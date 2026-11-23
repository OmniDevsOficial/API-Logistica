package com.ominidevs.operacional.veiculo.dto;

import com.ominidevs.operacional.veiculo.entities.Veiculo;

/**
 * Veículo como exposto em GET /veiculos.
 *
 * @param id identificador interno.
 * @param placa placa normalizada (ex.: "ABC1D23").
 * @param tipo tipo em maiúsculas (ex.: "CAVALO MECÂNICO"); o front formata para exibir.
 * @param marca marca, quando importada.
 * @param modelo modelo (o "nome" do veículo), quando importado.
 * @param ativo situação na frota; {@code null} quando não informada.
 * @param motoristaId motorista atual; {@code null} quando sem vínculo.
 * @param motoristaNome nome do motorista atual; {@code null} quando sem vínculo.
 */
public record VeiculoResponse(
        Integer id,
        String placa,
        String tipo,
        String marca,
        String modelo,
        Boolean ativo,
        Integer motoristaId,
        String motoristaNome) {

    /**
     * Converte a entidade. O motorista precisa estar carregado (ver
     * {@code VeiculoRepository}, que já o busca junto).
     */
    public static VeiculoResponse de(Veiculo veiculo) {
        var motorista = veiculo.getMotorista();
        return new VeiculoResponse(
                veiculo.getId(),
                veiculo.getPlaca(),
                veiculo.getTipo(),
                veiculo.getMarca(),
                veiculo.getModelo(),
                veiculo.getAtivo(),
                motorista == null ? null : motorista.getId(),
                motorista == null ? null : motorista.getNome());
    }
}
