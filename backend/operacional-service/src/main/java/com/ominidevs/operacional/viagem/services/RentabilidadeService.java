package com.ominidevs.operacional.viagem.services;

import java.math.BigDecimal;
public class RentabilidadeService {
    private RentabilidadeService() {}

    public static BigDecimal calcular(BigDecimal receita, BigDecimal custoFrete, BigDecimal pedagio) {
        if (receita == null || custoFrete == null || pedagio == null) return null;
        return receita.subtract(custoFrete.add(pedagio));
    }
}
