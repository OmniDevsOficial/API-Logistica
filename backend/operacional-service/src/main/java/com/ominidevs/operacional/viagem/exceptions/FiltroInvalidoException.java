package com.ominidevs.operacional.viagem.exceptions;

/**
 * Lançada quando um parâmetro do filtro de viagens (GET /viagens)
 * é inválido, ex: mês fora do formato YYYY-MM ou freteMin > freteMax.
 */
public class FiltroInvalidoException extends RuntimeException {

    public FiltroInvalidoException(String message) {
        super(message);
    }
}
