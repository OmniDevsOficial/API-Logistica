package com.ominidevs.operacional.viagem.services;

import java.math.BigDecimal;
public class RentabilidadeService {
    /**
     * Mesma fórmula de {@link #calcular} para agregações no Postgres.
     * Qualquer operando NULL resulta em NULL, como no Java.
     */
    public static final String EXPRESSAO_SQL = "(receita_frete - (custo_frete + pedagio))";

    private RentabilidadeService() {}

    public static BigDecimal calcular(BigDecimal receita, BigDecimal custoFrete, BigDecimal pedagio) {
        if (receita == null || custoFrete == null || pedagio == null) return null;
        return receita.subtract(custoFrete.add(pedagio));
    }
}
