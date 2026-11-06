package com.ominidevs.operacional.veiculo.exceptions;

/** Placa sem veículo cadastrado. Resulta em HTTP 404. */
public class VeiculoNaoEncontradoException extends RuntimeException {

    public VeiculoNaoEncontradoException(String placa) {
        super("Veículo não encontrado: " + placa + ".");
    }
}
