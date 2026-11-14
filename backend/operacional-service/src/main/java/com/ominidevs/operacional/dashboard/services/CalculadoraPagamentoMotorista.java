package com.ominidevs.operacional.dashboard.services;

import java.math.BigDecimal;
import java.math.RoundingMode;

import com.ominidevs.operacional.dashboard.projections.ComponentesPagamentoMotorista;

/**
 * Ponto único da fórmula de pagamento por motorista.
 *
 * <p>A fórmula ainda não foi definida pelo PO. Enquanto isso, o pagamento é a soma do
 * "Valor Frete" (sem S) das viagens do motorista no mês. Para trocá-la, altere apenas
 * {@link #calcular(ComponentesPagamentoMotorista)}.
 */
public final class CalculadoraPagamentoMotorista {

    private CalculadoraPagamentoMotorista() {}

    /**
     * Calcula o valor a pagar a partir dos componentes já somados no período.
     *
     * <p>Os componentes chegam somados pelo banco, então a fórmula deve ser linear
     * (somar por viagem e depois aplicar dá o mesmo resultado). Uma regra aplicada
     * viagem a viagem, como piso mínimo, exige mudar também a consulta.
     *
     * @param componentes valores somados das viagens do motorista.
     * @return valor a pagar com duas casas decimais; zero se não houver valor de frete.
     */
    public static BigDecimal calcular(ComponentesPagamentoMotorista componentes) {
        BigDecimal valorFrete = componentes.valorFrete() == null ? BigDecimal.ZERO : componentes.valorFrete();
        return valorFrete.setScale(2, RoundingMode.HALF_UP);
    }
}
