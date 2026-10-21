package com.ominidevs.operacional.motorista.projections;

import java.time.LocalDate;

public record MotoristaListagem(
        Integer id,
        String nome,
        String veiculoTipo,
        String veiculoPlaca,
        String status,
        String ultimaLocalizacao,
        LocalDate ultimaOperacao,
        LocalDate previsaoDisponibilidade,
        long quantidadeViagens) {}
