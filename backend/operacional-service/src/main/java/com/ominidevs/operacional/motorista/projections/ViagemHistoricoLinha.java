package com.ominidevs.operacional.motorista.projections;

import java.time.LocalDate;

import com.ominidevs.operacional.viagem.entities.StatusViagem;

public record ViagemHistoricoLinha(
        Integer id,
        String manifesto,
        String origem,
        String destino,
        LocalDate dataSaida,
        LocalDate previsaoChegada,
        StatusViagem status) {}
