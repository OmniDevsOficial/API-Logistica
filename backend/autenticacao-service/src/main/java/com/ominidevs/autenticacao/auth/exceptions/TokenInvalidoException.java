package com.ominidevs.autenticacao.auth.exceptions;

public class TokenInvalidoException extends RuntimeException {

    public TokenInvalidoException() {
        super("Token inválido ou expirado.");
    }
}