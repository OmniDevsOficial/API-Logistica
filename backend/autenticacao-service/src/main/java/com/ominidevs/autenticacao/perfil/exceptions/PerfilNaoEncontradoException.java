package com.ominidevs.autenticacao.perfil.exceptions;

public class PerfilNaoEncontradoException extends RuntimeException {

    public PerfilNaoEncontradoException() {
        super("Seu usuário não foi encontrado. Entre novamente.");
    }
}
