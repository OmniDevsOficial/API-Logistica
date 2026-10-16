package com.ominidevs.operacional.viagem.dto;

import java.math.BigDecimal;

public record RankingDestinoResponse(
        String destino,
        long quantidadeViagens,
        BigDecimal rentabilidadeMedia) {}
