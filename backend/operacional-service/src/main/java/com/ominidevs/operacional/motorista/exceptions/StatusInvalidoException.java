package com.ominidevs.operacional.motorista.exceptions;

public class StatusInvalidoException extends RuntimeException {

    private static final String MENSAGEM =
            "Status inválido: %s. Use DISPONIVEL, EM_OPERACAO ou INDISPONIVEL.";

    public StatusInvalidoException(String valor) {
        super(String.format(MENSAGEM, valor == null ? "vazio" : valor));
    }
}
