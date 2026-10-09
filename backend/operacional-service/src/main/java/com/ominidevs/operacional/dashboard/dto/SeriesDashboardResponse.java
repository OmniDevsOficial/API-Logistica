package com.ominidevs.operacional.dashboard.dto;

import java.util.List;

public record SeriesDashboardResponse(
        List<PontoSerieResponse> porMes,
        List<PontoSerieResponse> porVeiculo) {}
