package com.ominidevs.operacional.motorista.services;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ominidevs.operacional.indicadores.model.PeriodoConsulta;
import com.ominidevs.operacional.motorista.dto.MotoristaResumoResponse;
import com.ominidevs.operacional.motorista.dto.MotoristaResponseDTO;
import com.ominidevs.operacional.motorista.entities.Motorista;
import com.ominidevs.operacional.motorista.entities.StatusMotorista;
import com.ominidevs.operacional.motorista.exceptions.MotoristaNaoEncontradoException;
import com.ominidevs.operacional.motorista.projections.MotoristaListagem;
import com.ominidevs.operacional.motorista.projections.MotoristaStatusContagem;
import com.ominidevs.operacional.motorista.repositories.MotoristaConsultaRepository;
import com.ominidevs.operacional.motorista.repositories.MotoristaRepository;
import com.ominidevs.operacional.viagem.entities.StatusViagem;
import com.ominidevs.operacional.viagem.entities.Viagem;

@Service
public class MotoristaService {

    private final MotoristaRepository repository;
    private final MotoristaConsultaRepository consultaRepository;

    public MotoristaService(
            MotoristaRepository repository,
            MotoristaConsultaRepository consultaRepository
    ) {
        this.repository = repository;
        this.consultaRepository = consultaRepository;
    }

    public List<MotoristaResponseDTO> listar(StatusMotorista status, PeriodoConsulta periodo) {
        return consultaRepository.consultar(periodo, status).stream()
                .map(this::paraResponse)
                .toList();
    }

    public MotoristaResumoResponse resumo() {
        Map<StatusMotorista, Long> contagem = repository.contarPorStatus().stream()
                .collect(Collectors.toMap(
                        MotoristaStatusContagem::status,
                        MotoristaStatusContagem::quantidade));

        long disponiveis = contagem.getOrDefault(StatusMotorista.DISPONIVEL, 0L);
        long emOperacao = contagem.getOrDefault(StatusMotorista.EM_OPERACAO, 0L);
        long indisponiveis = contagem.getOrDefault(StatusMotorista.INDISPONIVEL, 0L);

        return new MotoristaResumoResponse(
                disponiveis,
                emOperacao,
                indisponiveis,
                disponiveis + emOperacao + indisponiveis
        );
    }

    public MotoristaResponseDTO alterarStatus(Integer id, StatusMotorista status) {
        Motorista motorista = repository.findById(id)
                .orElseThrow(() -> new MotoristaNaoEncontradoException(id));

        motorista.setStatus(status);
        repository.save(motorista);

        return paraResponse(motorista, quantidadeNoMesCorrente(id));
    }

    public void sincronizarComManifesto(List<Viagem> viagens) {
        List<Motorista> motoristas = viagens.stream()
                .collect(Collectors.groupingBy(this::identidade))
                .values().stream()
                .map(this::sincronizarGrupo)
                .toList();

        repository.saveAll(motoristas);
    }

    private long quantidadeNoMesCorrente(Integer id) {
        return consultaRepository.consultar(PeriodoConsulta.mesCorrente(), null).stream()
                .filter(linha -> linha.id().equals(id))
                .mapToLong(MotoristaListagem::quantidadeViagens)
                .findFirst()
                .orElse(0);
    }

    private Motorista sincronizarGrupo(List<Viagem> viagens) {
        Viagem ultima = viagens.stream()
                .max(Comparator.comparing(Viagem::getData))
                .orElseThrow();

        Motorista motorista = encontrarOuCriar(ultima);
        atualizarDadosDerivados(motorista, viagens, ultima);

        return motorista;
    }

    private Motorista encontrarOuCriar(Viagem viagem) {
        String cpf = normalizarCpf(viagem.getCPF());
        String nome = normalizarNome(viagem.getMotorista());

        List<Motorista> candidatos = cpf == null
                ? repository.buscarSemCpfPorNome(nome)
                : repository.buscarPorCpf(cpf);

        return candidatos.stream()
                .findFirst()
                .orElseGet(() -> new Motorista(
                        valorOuNulo(viagem.getMotorista()),
                        cpf,
                        LocalDate.now(),
                        StatusMotorista.DISPONIVEL
                ));
    }

    private void atualizarDadosDerivados(Motorista motorista, List<Viagem> viagens, Viagem ultima) {
        if (motorista.getUltimaOperacao() != null
                && ultima.getData().isBefore(motorista.getUltimaOperacao())) {
            return;
        }

        String nome = valorOuNulo(ultima.getMotorista());
        if (nome != null) {
            motorista.setNome(nome);
        }

        motorista.setVeiculoPlaca(valorOuNulo(ultima.getVeiculo()));
        motorista.setVeiculoTipo(valorOuNulo(ultima.getVeiculoTipo()));
        motorista.setUltimaOperacao(ultima.getData());
        motorista.setUltimaLocalizacao(valorOuNulo(ultima.getCidadeDestino()));
        motorista.setPrevisaoDisponibilidade(previsaoDisponibilidade(viagens));
    }

    private LocalDate previsaoDisponibilidade(List<Viagem> viagens) {
        return viagens.stream()
                .filter(viagem -> viagem.getStatus() == StatusViagem.EM_TRANSITO)
                .map(Viagem::getDataPrevisaoChegada)
                .filter(Objects::nonNull)
                .max(Comparator.naturalOrder())
                .orElse(null);
    }

    private IdentidadeMotorista identidade(Viagem viagem) {
        String cpf = normalizarCpf(viagem.getCPF());
        return new IdentidadeMotorista(
                cpf,
                cpf == null ? normalizarNome(viagem.getMotorista()) : null
        );
    }

    private String normalizarCpf(String cpf) {
        if (cpf == null) {
            return null;
        }

        String digitos = cpf.replaceAll("\\D", "");
        return digitos.length() == 11 ? digitos : null;
    }

    private String normalizarNome(String nome) {
        return nome == null ? "" : nome.trim().toLowerCase(Locale.ROOT);
    }

    private String valorOuNulo(String valor) {
        return valor == null || valor.isBlank() ? null : valor.trim();
    }

    private MotoristaResponseDTO paraResponse(MotoristaListagem linha) {
        return new MotoristaResponseDTO(
                linha.id(),
                linha.nome(),
                linha.veiculoTipo(),
                linha.veiculoPlaca(),
                linha.status(),
                linha.ultimaLocalizacao(),
                linha.ultimaOperacao(),
                linha.previsaoDisponibilidade(),
                linha.quantidadeViagens()
        );
    }

    private MotoristaResponseDTO paraResponse(Motorista motorista, long quantidadeViagens) {
        return new MotoristaResponseDTO(
                motorista.getId(),
                motorista.getNome(),
                motorista.getVeiculoTipo(),
                motorista.getVeiculoPlaca(),
                motorista.getStatus().name(),
                motorista.getUltimaLocalizacao(),
                motorista.getUltimaOperacao(),
                motorista.getPrevisaoDisponibilidade(),
                quantidadeViagens
        );
    }

    private record IdentidadeMotorista(String cpf, String nome) {}
}
