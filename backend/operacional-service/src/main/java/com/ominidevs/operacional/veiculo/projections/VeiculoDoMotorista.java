package com.ominidevs.operacional.veiculo.projections;

/** Linha de veículo usada para montar a lista de veículos de cada motorista. */
public record VeiculoDoMotorista(
        Integer motoristaId,
        String placa,
        String tipo,
        String modelo,
        Boolean ativo) {}
