package com.ominidevs.operacional.motorista.dto;

import java.time.LocalDate;

import com.ominidevs.operacional.motorista.model.StatusHistoricoViagem;

public record ViagemHistoricoResponse(
        Integer id,
        String manifesto,
        String origem,
        String destino,
        LocalDate dataSaida,
        LocalDate previsaoChegada,
        StatusHistoricoViagem status) {}
