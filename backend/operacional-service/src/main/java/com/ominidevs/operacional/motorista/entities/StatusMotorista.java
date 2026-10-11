package com.ominidevs.operacional.motorista.entities;

import java.util.Locale;

import com.ominidevs.operacional.motorista.exceptions.StatusInvalidoException;

public enum StatusMotorista {

    DISPONIVEL,
    EM_OPERACAO,
    INDISPONIVEL;

    public static StatusMotorista parse(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new StatusInvalidoException(valor);
        }

        try {
            return valueOf(valor.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            throw new StatusInvalidoException(valor);
        }
    }
}
