package com.ominidevs.operacional.indicadores.dto;

import java.math.BigDecimal;

public record UtilizacaoMotoristaResponse(
        String chave, Integer motoristaId, String nome,
        long quantidadeViagens, BigDecimal porcentagem, String status) {}
