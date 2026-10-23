package com.ominidevs.operacional.viagem.dto;

import java.math.BigDecimal;

public record RentabilidadeMotoristaResponse(
        String motorista,
        BigDecimal rentabilidadeMedia,
        long quantidadeViagensConsideradas) {}
