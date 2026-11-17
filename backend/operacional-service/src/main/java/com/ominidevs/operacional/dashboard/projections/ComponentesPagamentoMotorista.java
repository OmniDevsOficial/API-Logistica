package com.ominidevs.operacional.dashboard.projections;

import java.math.BigDecimal;

/**
 * Valores somados das viagens de um motorista no período, insumo da fórmula de pagamento.
 *
 * <p>Ao trocar a fórmula de pagamento, acrescente aqui o novo componente somado e a
 * coluna correspondente em {@code DashboardRepository#consultarComponentesPagamento}.
 *
 * @param chave CPF normalizado (só dígitos) ou {@code SEM_IDENTIFICACAO}.
 * @param motorista nome exibido do motorista.
 * @param viagens quantidade de viagens do motorista no período.
 * @param valorFrete soma da coluna "Valor Frete" das viagens; nulo se nenhuma tiver valor.
 */
public record ComponentesPagamentoMotorista(
        String chave, String motorista, long viagens, BigDecimal valorFrete) {}
