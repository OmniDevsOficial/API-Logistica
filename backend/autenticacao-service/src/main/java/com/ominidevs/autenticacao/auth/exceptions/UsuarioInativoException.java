package com.ominidevs.autenticacao.auth.exceptions;

public class UsuarioInativoException extends RuntimeException {

    public UsuarioInativoException() {
        super("Seu acesso está desativado. Fale com o gestor.");
    }
}
