package com.ominidevs.operacional.dashboard.projections;

import java.math.BigDecimal;

public record ResumoViagens(
        long totalViagens,
        BigDecimal freteTotal,
        BigDecimal freteMedio,
        Long kmTotal,
        long motoristasAtivos,
        long veiculosUtilizados,
        long viagensPendentes,
        long viagensEmTransito,
        long viagensFinalizadas) {}
