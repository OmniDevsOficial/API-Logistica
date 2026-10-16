package com.ominidevs.operacional.viagem.dto;

import java.math.BigDecimal;

public record RentabilidadeViagemResponse(
        String manifesto,
        String motorista,
        String origem,
        String destino,
        BigDecimal receita,
        BigDecimal custoFrete,
        BigDecimal pedagio,
        BigDecimal rentabilidade) {}
