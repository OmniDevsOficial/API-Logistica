package com.ominidevs.operacional.motorista.dto;

public record MotoristaResumoResponse(
        long disponiveis,
        long emOperacao,
        long indisponiveis,
        long total) {}
