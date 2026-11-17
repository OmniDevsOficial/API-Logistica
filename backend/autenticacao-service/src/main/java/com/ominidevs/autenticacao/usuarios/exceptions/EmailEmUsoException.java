package com.ominidevs.autenticacao.usuarios.exceptions;

public class EmailEmUsoException extends RuntimeException {

    public EmailEmUsoException() {
        super("Esse e-mail já está em uso.");
    }
}
