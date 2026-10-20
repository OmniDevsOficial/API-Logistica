package com.ominidevs.operacional.dashboard.projections;

public record ResumoViagens(
        long totalViagens,
        Long kmTotal,
        long motoristasAtivos,
        long veiculosUtilizados,
        long viagensPendentes,
        long viagensEmTransito,
        long viagensFinalizadas) {}
