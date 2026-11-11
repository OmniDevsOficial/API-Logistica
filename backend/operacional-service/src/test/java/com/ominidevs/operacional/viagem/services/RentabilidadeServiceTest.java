package com.ominidevs.operacional.viagem.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

class RentabilidadeServiceTest {
    private BigDecimal valor(String valor) { return new BigDecimal(valor); }

    @Test void calculaCenarioPositivoDaPlanilha() {
        assertEquals(valor("796.40"), RentabilidadeService.calcular(valor("3855.60"), valor("3059.20")));
    }

    @Test void calculaCenarioNegativoDaPlanilha() {
        assertEquals(valor("-594.99"), RentabilidadeService.calcular(valor("2120.58"), valor("2715.57")));
    }

    @Test void retornaNullSeQualquerComponenteForNull() {
        assertNull(RentabilidadeService.calcular(null, valor("1")));
        assertNull(RentabilidadeService.calcular(valor("1"), null));
    }

    @Test void calculaValoresZero() {
        assertEquals(valor("-100"), RentabilidadeService.calcular(valor("0"), valor("100")));
        assertEquals(valor("500"), RentabilidadeService.calcular(valor("500"), valor("0")));
    }
}
