package com.ominidevs.operacional.motorista.dto;

import java.time.LocalDate;
import java.util.List;

import com.ominidevs.operacional.veiculo.dto.VeiculoResumoResponse;

/**
 * Motorista como exibido na tela de equipe.
 *
 * <p>{@code tipoVeiculo}, {@code placa} e {@code modeloVeiculo} descrevem o
 * veículo principal: o primeiro de {@code veiculos} quando o motorista tem
 * veículo cadastrado pela importação de veículos; senão, o último veículo
 * informado no manifesto (sem modelo).
 *
 * @param veiculos todos os veículos cadastrados do motorista, ativos primeiro;
 *     vazio quando não há cadastro.
 */
public record MotoristaResponseDTO(
        Integer id,
        String nome,
        String cpf,
        String tipoVeiculo,
        String placa,
        String status,
        String localizacao,
        LocalDate ultimaOperacao,
        LocalDate previsaoDisponibilidade,
        long quantidadeViagens,
        String modeloVeiculo,
        List<VeiculoResumoResponse> veiculos) {

    public MotoristaResponseDTO {
        veiculos = veiculos == null ? List.of() : List.copyOf(veiculos);
    }

    /** Motorista sem veículos cadastrados (formato anterior à importação de veículos). */
    public MotoristaResponseDTO(
            Integer id,
            String nome,
            String cpf,
            String tipoVeiculo,
            String placa,
            String status,
            String localizacao,
            LocalDate ultimaOperacao,
            LocalDate previsaoDisponibilidade,
            long quantidadeViagens) {
        this(id, nome, cpf, tipoVeiculo, placa, status, localizacao, ultimaOperacao,
                previsaoDisponibilidade, quantidadeViagens, null, List.of());
    }
}
