package com.ominidevs.operacional.dashboard.projections;

import java.math.BigDecimal;

public record RentabilidadeTipoVeiculo(String tipo, long viagens, BigDecimal receita, BigDecimal custo) {}
