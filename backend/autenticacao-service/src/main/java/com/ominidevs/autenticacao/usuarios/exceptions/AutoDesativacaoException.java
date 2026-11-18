package com.ominidevs.autenticacao.usuarios.exceptions;

public class AutoDesativacaoException extends RuntimeException {

    public AutoDesativacaoException() {
        super("Você não pode desativar o seu próprio usuário.");
    }
}
