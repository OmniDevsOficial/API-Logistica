package com.ominidevs.operacional.veiculo.services;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.ominidevs.operacional.motorista.entities.Motorista;
import com.ominidevs.operacional.motorista.entities.StatusMotorista;
import com.ominidevs.operacional.motorista.model.NomeMotorista;
import com.ominidevs.operacional.motorista.repositories.MotoristaRepository;
import com.ominidevs.operacional.veiculo.dto.ImportacaoVeiculoResponse;
import com.ominidevs.operacional.veiculo.dto.OcorrenciaLinhaVeiculo;
import com.ominidevs.operacional.veiculo.entities.Veiculo;
import com.ominidevs.operacional.veiculo.model.LinhaCsvVeiculo;
import com.ominidevs.operacional.veiculo.model.Placa;
import com.ominidevs.operacional.veiculo.model.PlanilhaVeiculos;
import com.ominidevs.operacional.veiculo.repositories.VeiculoRepository;

/**
 * Importa o CSV de veículos: cadastra ou atualiza veículos pela placa e liga
 * cada um ao motorista atual, cadastrando o motorista quando ele não existe.
 *
 * <p>Toda linha é validada antes de gravar, então uma linha inválida é apenas
 * reportada e não desfaz as outras. A gravação ocorre em uma única transação.
 * Reimportar o mesmo arquivo não duplica veículos nem motoristas.
 *
 * <p>O CSV não traz CPF, então o motorista é reconhecido pelo nome (sem
 * diferença de caixa, acento ou espaços). Com homônimos não há como saber
 * qual é o correto e o veículo fica sem motorista, com um aviso na resposta.
 */
@Service
public class ImportacaoVeiculoService {

    private static final int TAMANHO_MAXIMO_TIPO = 50;
    private static final int TAMANHO_MAXIMO_NOME = 255;
    private static final int TAMANHO_MAXIMO_MARCA_MODELO = 100;

    private final LeitorCsvVeiculo leitor;
    private final VeiculoRepository veiculoRepository;
    private final MotoristaRepository motoristaRepository;

    public ImportacaoVeiculoService(
            LeitorCsvVeiculo leitor,
            VeiculoRepository veiculoRepository,
            MotoristaRepository motoristaRepository
    ) {
        this.leitor = leitor;
        this.veiculoRepository = veiculoRepository;
        this.motoristaRepository = motoristaRepository;
    }

    /**
     * Importa o arquivo de veículos.
     *
     * @param arquivo CSV de veículos.
     * @return resumo com contagens, linhas rejeitadas e avisos.
     * @throws com.ominidevs.operacional.veiculo.exceptions.ArquivoVeiculoInvalidoException
     *     se o arquivo inteiro for inválido.
     */
    @Transactional
    public ImportacaoVeiculoResponse importar(MultipartFile arquivo) {
        PlanilhaVeiculos planilha = leitor.ler(arquivo);
        List<LinhaCsvVeiculo> linhas = planilha.linhas();

        List<OcorrenciaLinhaVeiculo> erros = new ArrayList<>();
        List<OcorrenciaLinhaVeiculo> avisos = new ArrayList<>();
        List<LinhaCsvVeiculo> validas = validar(linhas, erros);

        Map<String, Veiculo> existentes = validas.isEmpty()
                ? Map.of()
                : veiculoRepository.findByPlacaIn(validas.stream().map(LinhaCsvVeiculo::placa).toList())
                        .stream()
                        .collect(Collectors.toMap(Veiculo::getPlaca, Function.identity()));
        Map<String, List<Motorista>> motoristasPorNome = validas.isEmpty()
                ? new HashMap<>()
                : motoristasPorChaveDeNome();

        List<Motorista> motoristasNovos = new ArrayList<>();
        List<Veiculo> veiculos = new ArrayList<>();
        int cadastrados = 0;
        int semMotorista = 0;

        for (LinhaCsvVeiculo linha : validas) {
            Veiculo veiculo = existentes.get(linha.placa());
            if (veiculo == null) {
                veiculo = new Veiculo(linha.placa());
                cadastrados++;
            }

            Motorista motorista = resolverMotorista(
                    linha, veiculo, motoristasPorNome, motoristasNovos, avisos);
            if (motorista == null) {
                semMotorista++;
            }

            veiculo.setTipo(linha.tipo());
            veiculo.setMotorista(motorista);
            aplicarColunasOpcionais(planilha, linha, veiculo, avisos);
            veiculos.add(veiculo);
        }

        motoristaRepository.saveAll(motoristasNovos);
        veiculoRepository.saveAll(veiculos);

        return new ImportacaoVeiculoResponse(
                linhas.size(),
                cadastrados,
                veiculos.size() - cadastrados,
                motoristasNovos.size(),
                semMotorista,
                erros.size(),
                erros,
                avisos);
    }

    /**
     * Separa as linhas válidas e registra o motivo das inválidas. Uma placa
     * repetida no arquivo só é rejeitada se já houver uma linha válida com ela.
     */
    private List<LinhaCsvVeiculo> validar(List<LinhaCsvVeiculo> linhas, List<OcorrenciaLinhaVeiculo> erros) {
        Map<String, Integer> linhaPorPlaca = new HashMap<>();
        List<LinhaCsvVeiculo> validas = new ArrayList<>();

        for (LinhaCsvVeiculo linha : linhas) {
            String problema = problemaDaLinha(linha, linhaPorPlaca);
            if (problema != null) {
                erros.add(new OcorrenciaLinhaVeiculo(linha.numero(), linha.placa(), problema));
                continue;
            }
            linhaPorPlaca.put(linha.placa(), linha.numero());
            validas.add(linha);
        }
        return validas;
    }

    private String problemaDaLinha(LinhaCsvVeiculo linha, Map<String, Integer> linhaPorPlaca) {
        if (linha.placa() == null) {
            return "Placa não informada.";
        }
        if (!Placa.ehValida(linha.placa())) {
            return "Placa inválida. Use o formato AAA9999 ou AAA9A99.";
        }
        if (linha.tipo() == null) {
            return "Tipo de veículo não informado.";
        }
        if (linha.tipo().length() > TAMANHO_MAXIMO_TIPO) {
            return "Tipo de veículo excede " + TAMANHO_MAXIMO_TIPO + " caracteres.";
        }
        if (linha.motorista() != null && linha.motorista().length() > TAMANHO_MAXIMO_NOME) {
            return "Nome do motorista excede " + TAMANHO_MAXIMO_NOME + " caracteres.";
        }
        Integer primeira = linhaPorPlaca.get(linha.placa());
        if (primeira != null) {
            return "Placa repetida no arquivo (já informada na linha " + primeira + ").";
        }
        return null;
    }

    /**
     * Marca, modelo e status só são aplicados quando a coluna existe na
     * planilha. Valor problemático não rejeita a linha: o campo é mantido como
     * estava e a linha recebe um aviso.
     */
    private void aplicarColunasOpcionais(
            PlanilhaVeiculos planilha,
            LinhaCsvVeiculo linha,
            Veiculo veiculo,
            List<OcorrenciaLinhaVeiculo> avisos
    ) {
        if (planilha.possuiMarca()) {
            if (cabe(linha.marca())) {
                veiculo.setMarca(linha.marca());
            } else {
                avisos.add(new OcorrenciaLinhaVeiculo(linha.numero(), linha.placa(),
                        "Marca excede " + TAMANHO_MAXIMO_MARCA_MODELO + " caracteres e não foi gravada."));
            }
        }
        if (planilha.possuiModelo()) {
            if (cabe(linha.modelo())) {
                veiculo.setModelo(linha.modelo());
            } else {
                avisos.add(new OcorrenciaLinhaVeiculo(linha.numero(), linha.placa(),
                        "Modelo excede " + TAMANHO_MAXIMO_MARCA_MODELO + " caracteres e não foi gravado."));
            }
        }
        if (planilha.possuiStatus()) {
            String chave = NomeMotorista.chave(linha.status());
            if (chave == null) {
                veiculo.setAtivo(null);
            } else if (chave.equals("ativo")) {
                veiculo.setAtivo(true);
            } else if (chave.equals("inativo")) {
                veiculo.setAtivo(false);
            } else {
                avisos.add(new OcorrenciaLinhaVeiculo(linha.numero(), linha.placa(),
                        "Status do veículo \"" + linha.status() + "\" não reconhecido. Use Ativo ou Inativo."));
            }
        }
    }

    private static boolean cabe(String valor) {
        return valor == null || valor.length() <= TAMANHO_MAXIMO_MARCA_MODELO;
    }

    private Map<String, List<Motorista>> motoristasPorChaveDeNome() {
        Map<String, List<Motorista>> porNome = new HashMap<>();
        for (Motorista motorista : motoristaRepository.findAll()) {
            String chave = NomeMotorista.chave(motorista.getNome());
            if (chave != null) {
                porNome.computeIfAbsent(chave, c -> new ArrayList<>()).add(motorista);
            }
        }
        return porNome;
    }

    /**
     * Encontra o motorista da linha pelo nome ou o cadastra. Motoristas criados
     * aqui entram no mapa, para que a próxima linha do mesmo motorista no
     * arquivo reutilize o cadastro em vez de criar outro.
     *
     * @return o motorista, ou {@code null} quando a linha não traz motorista ou
     *     o nome é ambíguo.
     */
    private Motorista resolverMotorista(
            LinhaCsvVeiculo linha,
            Veiculo veiculo,
            Map<String, List<Motorista>> motoristasPorNome,
            List<Motorista> motoristasNovos,
            List<OcorrenciaLinhaVeiculo> avisos
    ) {
        String chave = NomeMotorista.chave(linha.motorista());
        if (chave == null) {
            return null;
        }

        List<Motorista> candidatos = motoristasPorNome.get(chave);
        if (candidatos == null || candidatos.isEmpty()) {
            Motorista novo = new Motorista(linha.motorista(), null, LocalDate.now(), StatusMotorista.DISPONIVEL);
            motoristasPorNome.put(chave, new ArrayList<>(List.of(novo)));
            motoristasNovos.add(novo);
            return novo;
        }
        if (candidatos.size() == 1) {
            return candidatos.getFirst();
        }

        // Homônimos: mantém o vínculo atual se ele for um dos candidatos.
        Motorista atual = veiculo.getMotorista();
        if (atual != null && candidatos.stream().anyMatch(c -> Objects.equals(c.getId(), atual.getId()))) {
            return atual;
        }
        avisos.add(new OcorrenciaLinhaVeiculo(linha.numero(), linha.placa(),
                "Há " + candidatos.size() + " motoristas cadastrados com o nome \"" + linha.motorista()
                        + "\". O veículo foi gravado sem motorista."));
        return null;
    }
}
