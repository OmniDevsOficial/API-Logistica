package com.ominidevs.operacional.motorista.exceptions;

public class MotoristaNaoEncontradoException extends RuntimeException {

    public MotoristaNaoEncontradoException(Integer id) {
        super("Motorista não encontrado: " + id);
    }
}
