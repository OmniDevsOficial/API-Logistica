package com.ominidevs.operacional.veiculo.dto;

import java.time.LocalDateTime;
import java.util.Map;

import com.ominidevs.operacional.veiculo.entities.Veiculo;
import com.ominidevs.operacional.veiculo.model.Placa;

public record VeiculoFrotaResponse(
        Integer id,
        String placa,
        String tipo,
        String marca,
        String modelo,
        String combustivel,
        String motorista,
        LocalDateTime atualizadoEm,
        Map<String, String> dadosAdicionais) {

    public static VeiculoFrotaResponse de(Veiculo veiculo) {
        var motorista = veiculo.getMotorista();
        return new VeiculoFrotaResponse(
                veiculo.getId(),
                Placa.formatar(veiculo.getPlaca()),
                veiculo.getTipo(),
                veiculo.getMarca(),
                veiculo.getModelo(),
                veiculo.getCombustivel(),
                motorista == null ? null : motorista.getNome(),
                veiculo.getAtualizadoEm(),
                veiculo.getDadosAdicionais());
    }
}
