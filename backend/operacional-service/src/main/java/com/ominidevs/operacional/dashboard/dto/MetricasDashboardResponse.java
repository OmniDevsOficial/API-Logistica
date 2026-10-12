package com.ominidevs.operacional.dashboard.dto;

import java.math.BigDecimal;

public record MetricasDashboardResponse(
        long totalViagens,
        BigDecimal freteTotal,
        BigDecimal freteMedio,
        Long kmTotal,
        long motoristasAtivos,
        long veiculosUtilizados,
        ViagensPorStatusResponse viagensPorStatus,
        BigDecimal custoTotal,
        BigDecimal custoMedio,
        BigDecimal rentabilidadeTotal,
        BigDecimal rentabilidadeMedia,
        BigDecimal taxaOcupacao) {}
