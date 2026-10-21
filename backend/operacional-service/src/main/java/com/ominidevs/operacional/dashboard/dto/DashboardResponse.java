package com.ominidevs.operacional.dashboard.dto;

import java.util.List;

import com.ominidevs.operacional.indicadores.dto.UtilizacaoMotoristaResponse;

public record DashboardResponse(
        String dataInicio,
        String dataFim,
        String status,
        MetricasDashboardResponse metricas,
        SeriesDashboardResponse series,
        List<UtilizacaoMotoristaResponse> utilizacaoMotoristas) {}
