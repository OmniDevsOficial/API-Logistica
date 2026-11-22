package com.ominidevs.operacional.dashboard.services;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;

import com.ominidevs.operacional.dashboard.projections.ComponentesPagamentoMotorista;

import static org.junit.jupiter.api.Assertions.assertEquals;

class CalculadoraPagamentoMotoristaTest {

    @Test
    void pagamentoEASomaDoValorFrete() {
        var componentes = new ComponentesPagamentoMotorista("123", "Ana", 3, new BigDecimal("2129.7"));

        assertEquals(new BigDecimal("2129.70"), CalculadoraPagamentoMotorista.calcular(componentes));
    }

    @Test
    void semValorFretePagamentoEZero() {
        var componentes = new ComponentesPagamentoMotorista("123", "Ana", 1, null);

        assertEquals(new BigDecimal("0.00"), CalculadoraPagamentoMotorista.calcular(componentes));
    }
}
