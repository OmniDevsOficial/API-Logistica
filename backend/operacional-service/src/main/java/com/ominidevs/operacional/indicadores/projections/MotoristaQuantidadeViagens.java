package com.ominidevs.operacional.indicadores.projections;

// Chave estável: CPF normalizado, ou SEM_IDENTIFICACAO. Nome é apenas para exibição.
public record MotoristaQuantidadeViagens(
        String chave, Integer motoristaId, String nome, long quantidadeViagens) {}
