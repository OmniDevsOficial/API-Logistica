package com.ominidevs.operacional.dashboard.dto;

import java.math.BigDecimal;

public record PontoRentabilidadeResponse(String rotulo, long viagens, BigDecimal rentabilidade) {}
