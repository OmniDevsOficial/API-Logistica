package com.ominidevs.operacional.dashboard.dto;

import java.math.BigDecimal;

public record RentabilidadePorTipoResponse(
        String tipo,
        long viagens,
        BigDecimal receita,
        BigDecimal custo,
        BigDecimal rentabilidade,
        BigDecimal mediaPorViagem) {}
