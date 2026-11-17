package com.ominidevs.autenticacao.usuarios.exceptions;

import java.util.Map;

public class CamposInvalidosException extends RuntimeException {

    private final transient Map<String, String> campos;

    public CamposInvalidosException(Map<String, String> campos) {
        super("Campos inválidos.");
        this.campos = Map.copyOf(campos);
    }

    public Map<String, String> getCampos() {
        return campos;
    }
}
