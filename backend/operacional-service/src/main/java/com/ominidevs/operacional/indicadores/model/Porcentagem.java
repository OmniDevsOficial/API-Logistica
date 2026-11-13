package com.ominidevs.operacional.indicadores.model;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Percentual único do backend (parte ÷ total × 100), com duas casas e
 * arredondamento HALF_UP. A frequência dos motoristas usa dias em operação
 * divididos por 30.
 */
public final class Porcentagem {

    private Porcentagem() {}

    public static BigDecimal calcular(long parte, long total) {
        if (total == 0) return new BigDecimal("0.00");
        // Arredondamento individual: a soma exibida pode ser 99,99% ou 100,01%.
        return BigDecimal.valueOf(parte).multiply(BigDecimal.valueOf(100))
                .divide(BigDecimal.valueOf(total), 2, RoundingMode.HALF_UP);
    }
}
