package com.ominidevs.operacional.dashboard.dto;

import java.math.BigDecimal;

public record DestinoMaisRentavelResponse(String destino, long viagens, BigDecimal rentabilidadeTotal) {}
