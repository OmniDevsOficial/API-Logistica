package com.ominidevs.operacional.dashboard.dto;

import java.math.BigDecimal;

/**
 * Pagamento consolidado de um motorista no mês consultado.
 *
 * @param motorista nome do motorista.
 * @param cpf CPF só com dígitos, usado pelo front para cruzar com o ranking; nulo sem identificação.
 * @param quantidadeViagens viagens do motorista no mês.
 * @param valorAPagar valor calculado por {@code CalculadoraPagamentoMotorista}.
 */
public record PagamentoMotoristaResponse(
        String motorista,
        String cpf,
        long quantidadeViagens,
        BigDecimal valorAPagar) {}
