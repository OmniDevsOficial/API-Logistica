package com.ominidevs.operacional.motorista.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ominidevs.operacional.motorista.dto.PaginaHistoricoViagensResponse;
import com.ominidevs.operacional.motorista.dto.ViagemHistoricoResponse;
import com.ominidevs.operacional.motorista.entities.Motorista;
import com.ominidevs.operacional.motorista.exceptions.MotoristaNaoEncontradoException;
import com.ominidevs.operacional.motorista.exceptions.PaginacaoInvalidaException;
import com.ominidevs.operacional.motorista.model.StatusHistoricoViagem;
import com.ominidevs.operacional.motorista.projections.ViagemHistoricoLinha;
import com.ominidevs.operacional.motorista.repositories.HistoricoViagemConsultaRepository;
import com.ominidevs.operacional.motorista.repositories.MotoristaRepository;

@Service
public class HistoricoViagemService {

    static final int TAMANHO_MAXIMO = 50;

    private final MotoristaRepository motoristaRepository;
    private final HistoricoViagemConsultaRepository consultaRepository;

    public HistoricoViagemService(
            MotoristaRepository motoristaRepository,
            HistoricoViagemConsultaRepository consultaRepository) {
        this.motoristaRepository = motoristaRepository;
        this.consultaRepository = consultaRepository;
    }

    public PaginaHistoricoViagensResponse listar(Integer motoristaId, int pagina, int tamanho) {
        if (pagina < 0) {
            throw new PaginacaoInvalidaException("A página deve ser maior ou igual a zero.");
        }
        if (tamanho < 1 || tamanho > TAMANHO_MAXIMO) {
            throw new PaginacaoInvalidaException(
                    "O tamanho da página deve estar entre 1 e " + TAMANHO_MAXIMO + ".");
        }

        Motorista motorista = motoristaRepository.findById(motoristaId)
                .orElseThrow(() -> new MotoristaNaoEncontradoException(motoristaId));

        long total = consultaRepository.contar(motorista.getCpf(), motorista.getNome());
        if (total == 0) {
            return new PaginaHistoricoViagensResponse(List.of(), pagina, tamanho, 0, 0, true);
        }

        long deslocamento = (long) pagina * tamanho;
        List<ViagemHistoricoResponse> viagens = consultaRepository
                .listar(motorista.getCpf(), motorista.getNome(), tamanho, deslocamento)
                .stream()
                .map(this::paraResponse)
                .toList();

        int totalPaginas = (int) ((total + tamanho - 1) / tamanho);

        return new PaginaHistoricoViagensResponse(
                viagens, pagina, tamanho, total, totalPaginas, pagina + 1 >= totalPaginas);
    }

    private ViagemHistoricoResponse paraResponse(ViagemHistoricoLinha linha) {
        return new ViagemHistoricoResponse(
                linha.id(),
                linha.manifesto(),
                linha.origem(),
                linha.destino(),
                linha.dataSaida(),
                linha.previsaoChegada(),
                StatusHistoricoViagem.de(linha.status()));
    }
}
