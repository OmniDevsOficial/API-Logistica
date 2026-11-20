package com.ominidevs.operacional.viagem.services;

import com.ominidevs.operacional.indicadores.exceptions.IndicadorInvalidoException;
import com.ominidevs.operacional.indicadores.model.PeriodoConsulta;
import com.ominidevs.operacional.importacao.dto.ResumoImportacao;
import com.ominidevs.operacional.importacao.entities.TipoImportacao;
import com.ominidevs.operacional.importacao.services.ImportacaoHistoricoService;
import com.ominidevs.operacional.motorista.services.MotoristaService;
import com.ominidevs.operacional.viagem.clients.ManifestoClient;
import com.ominidevs.operacional.viagem.dto.ManifestoDTO;
import com.ominidevs.operacional.viagem.dto.ImportacaoManifestoResponse;
import com.ominidevs.operacional.viagem.dto.ErroLinhaImportacao;
import com.ominidevs.operacional.viagem.dto.RankingDestinoResponse;
import com.ominidevs.operacional.viagem.dto.RentabilidadeMotoristaResponse;
import com.ominidevs.operacional.viagem.entities.StatusViagem;
import com.ominidevs.operacional.viagem.entities.Viagem;
import com.ominidevs.operacional.viagem.exceptions.FiltroInvalidoException;
import com.ominidevs.operacional.viagem.mappers.ManifestoMapper;
import com.ominidevs.operacional.viagem.repositories.ViagemRepository;
import com.ominidevs.operacional.viagem.specifications.ViagemSpecifications;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import com.ominidevs.operacional.viagem.dto.RentabilidadeViagemResponse;

@Service
public class ViagemService {

    private final ManifestoClient manifestoClient;
    private final ManifestoMapper manifestoMapper;
    private final ViagemRepository viagemRepository;
    private final MotoristaService motoristaService;
    private final ImportacaoHistoricoService historico;

    public ViagemService(
            ManifestoClient manifestoClient,
            ManifestoMapper manifestoMapper,
            ViagemRepository viagemRepository,
            MotoristaService motoristaService,
            ImportacaoHistoricoService historico
    ) {
        this.manifestoClient = manifestoClient;
        this.manifestoMapper = manifestoMapper;
        this.viagemRepository = viagemRepository;
        this.motoristaService = motoristaService;
        this.historico = historico;
    }

    public ImportacaoManifestoResponse importarManifesto(MultipartFile file) {
        try {
            return importarEEregistraHistorico(file);
        } catch (RuntimeException excecao) {
            // Arquivo recusado, relatorio fora do ar ou falha na gravação: a
            // tentativa entra no histórico como ERRO, com o mesmo motivo que o
            // usuário vê na tela. A gravação é em transação própria para não
            // ser desfeita junto com o resto.
            historico.registrarFalha(TipoImportacao.MANIFESTO, file);
            throw excecao;
        }
    }

    private ImportacaoManifestoResponse importarEEregistraHistorico(MultipartFile file) {

        validarArquivo(file);

        List<ManifestoDTO> manifestos =
                manifestoClient.enviar(file);

        java.util.Map<String, Viagem> viagensPorManifesto = new java.util.LinkedHashMap<>();
        List<ErroLinhaImportacao> erros = new java.util.ArrayList<>();
        for (ManifestoDTO manifesto : manifestos) {
            try {
                Viagem viagem = manifestoMapper.toEntity(manifesto);
                viagensPorManifesto.put(viagem.getManifesto(), viagem);
            } catch (IllegalArgumentException ex) {
                erros.add(new ErroLinhaImportacao(manifesto.getNumeroLinha(), manifesto.getManifesto(), ex.getMessage()));
            }
        }
        List<Viagem> viagens = new java.util.ArrayList<>(viagensPorManifesto.values());

        List<Viagem> registrosExistentes = viagens.isEmpty()
                ? List.of()
                : viagemRepository.findByManifestoIn(
                        viagens.stream().map(Viagem::getManifesto).distinct().toList());

        Set<String> manifestosExistentes = registrosExistentes
                .stream()
                .map(Viagem::getManifesto)
                .collect(Collectors.toSet());

        List<String> manifestosDuplicados = viagens.stream()
                .map(Viagem::getManifesto)
                .filter(manifestosExistentes::contains)
                .distinct()
                .toList();

        java.util.Map<String, Viagem> existentesPorManifesto = registrosExistentes.stream()
                .collect(Collectors.toMap(Viagem::getManifesto, v -> v, (a, b) -> a));
        List<Viagem> novasViagens = new java.util.ArrayList<>();
        // Toda existente entra na gravação (mesmo sem mudança), para manter a
        // sincronização de motorista igual ao que era antes desta tela.
        List<Viagem> existentesGravadas = new java.util.ArrayList<>();
        int criados = 0;
        int atualizados = 0;
        int ignorados = 0;
        for (Viagem viagem : viagens) {
            Viagem existente = existentesPorManifesto.get(viagem.getManifesto());
            if (existente == null) {
                novasViagens.add(viagem);
                criados++;
                continue;
            }
            if (mudouValores(existente, viagem)) {
                atualizados++;
            } else {
                ignorados++;
            }
            existente.setReceitaFrete(viagem.getReceitaFrete());
            existente.setCustoFrete(viagem.getCustoFrete());
            existente.setPedagio(viagem.getPedagio());
            existente.setValeFrete(viagem.getValeFrete());
            existente.setValorFrete(viagem.getValorFrete());
            existentesGravadas.add(existente);
        }

        List<Viagem> paraSalvar = new java.util.ArrayList<>(novasViagens);
        paraSalvar.addAll(existentesGravadas);
        List<Viagem> viagensImportadas = paraSalvar.isEmpty()
                ? List.of()
                : viagemRepository.saveAll(paraSalvar);
        motoristaService.sincronizarComManifesto(viagensImportadas);

        historico.registrar(TipoImportacao.MANIFESTO, file,
                new ResumoImportacao(criados, atualizados, ignorados, erros.size()));

        return new ImportacaoManifestoResponse(
                viagensImportadas, manifestosDuplicados, erros);
    }

    /**
     * Os cinco valores financeiros são os únicos campos atualizados numa
     * reimportação; sem diferença entre eles a linha é contada como ignorada.
     * Comparação por valor, então "1500,50" e "1500.50" são o mesmo frete.
     */
    private static boolean mudouValores(Viagem existente, Viagem importada) {
        return !igual(existente.getReceitaFrete(), importada.getReceitaFrete())
                || !igual(existente.getCustoFrete(), importada.getCustoFrete())
                || !igual(existente.getPedagio(), importada.getPedagio())
                || !igual(existente.getValeFrete(), importada.getValeFrete())
                || !igual(existente.getValorFrete(), importada.getValorFrete());
    }

    private static boolean igual(BigDecimal atual, BigDecimal novo) {
        if (atual == null || novo == null) {
            return atual == novo;
        }
        return atual.compareTo(novo) == 0;
    }

    private void validarArquivo(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "O arquivo não foi enviado ou está vazio."
            );
        }
    }

    public List<Viagem> filtrar(
            String destino,
            List<StatusViagem> status,
            BigDecimal freteMin,
            BigDecimal freteMax,
            String mes
    ) {

        validarFaixaFrete(freteMin, freteMax);

        LocalDate inicioMes = null;
        LocalDate fimMes = null;

        if (mes != null && !mes.isBlank()) {
            YearMonth periodo = converterMes(mes);
            inicioMes = periodo.atDay(1);
            fimMes = periodo.atEndOfMonth();
        }

        Specification<Viagem> filtro = ViagemSpecifications.destinoContem(destino)
                .and(ViagemSpecifications.statusEntre(status))
                .and(ViagemSpecifications.freteMinimo(freteMin))
                .and(ViagemSpecifications.freteMaximo(freteMax))
                .and(ViagemSpecifications.dataNoMes(inicioMes, fimMes));

        return viagemRepository.findAll(filtro);
    }

    public RentabilidadeViagemResponse consultarRentabilidade(String manifesto) {
        Viagem viagem = viagemRepository.findByManifesto(manifesto)
                .orElseThrow(() -> new java.util.NoSuchElementException("Viagem não encontrada: " + manifesto));
        return new RentabilidadeViagemResponse(viagem.getManifesto(), viagem.getMotorista(),
                viagem.getCidadeOrigem(), viagem.getCidadeDestino(), viagem.getReceitaFrete(),
                viagem.getValeFrete(),
                RentabilidadeService.calcular(viagem.getReceitaFrete(), viagem.getValeFrete()));
    }

    public List<RentabilidadeMotoristaResponse> rentabilidadeMediaPorMotorista(LocalDate inicio, LocalDate fim) {
        return viagemRepository.rentabilidadeMediaPorMotorista(inicio, fim);
    }

    /**
     * TOP 10 rotas (origem e destino) por rentabilidade média no período.
     * Agregação, desempate e limite são feitos no banco.
     *
     * @param dataInicio data inicial no formato dd/MM/aaaa, inclusiva.
     * @param dataFim data final no formato dd/MM/aaaa, inclusiva.
     * @return até 10 rotas ordenadas por rentabilidade média decrescente.
     * @throws IndicadorInvalidoException se alguma data estiver ausente, em
     *     formato inválido ou se o início for posterior ao fim.
     */
    public List<RankingDestinoResponse> rankingDestinosPorRentabilidade(
            String dataInicio, String dataFim) {

        PeriodoConsulta periodo = PeriodoConsulta.parse(dataInicio, dataFim);

        return viagemRepository.rankingDestinosPorRentabilidade(periodo.inicio(), periodo.fim());
    }

    private void validarFaixaFrete(BigDecimal freteMin, BigDecimal freteMax) {

        if (freteMin != null && freteMax != null && freteMin.compareTo(freteMax) > 0) {
            throw new FiltroInvalidoException(
                    "freteMin não pode ser maior que freteMax"
            );
        }
    }

    private YearMonth converterMes(String mes) {

        try {
            return YearMonth.parse(mes);
        } catch (DateTimeParseException e) {
            throw new FiltroInvalidoException(
                    "mes deve estar no formato YYYY-MM"
            );
        }
    }
}
