package com.ominidevs.operacional.dashboard.dto;

import java.util.List;

public record SeriesDashboardResponse(
        SerieRentabilidadeResponse rentabilidadePorPeriodo,
        List<PontoSerieResponse> porVeiculo) {}
