package com.ominidevs.operacional.dashboard.dto;

import java.util.List;

public record SerieRentabilidadeResponse(String agrupamento, List<PontoRentabilidadeResponse> pontos) {}
