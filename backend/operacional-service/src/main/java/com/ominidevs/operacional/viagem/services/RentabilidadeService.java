package com.ominidevs.operacional.viagem.services;

import java.math.BigDecimal;
public class RentabilidadeService {
    /**
     * Mesma fórmula de {@link #calcular} para agregações no Postgres.
     * Qualquer operando NULL resulta em NULL, como no Java.
     */
    public static final String EXPRESSAO_SQL = "(receita_frete - vale_frete)";

    private RentabilidadeService() {}

    public static BigDecimal calcular(BigDecimal receita, BigDecimal valeFrete) {
        if (receita == null || valeFrete == null) return null;
        return receita.subtract(valeFrete);
    }
}
