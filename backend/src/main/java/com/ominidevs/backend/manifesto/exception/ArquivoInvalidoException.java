package com.ominidevs.backend.manifesto.exception;

public class ArquivoInvalidoException extends RuntimeException {

    public ArquivoInvalidoException(String message) {
        super(message);
    }

    public ArquivoInvalidoException(String message, Throwable cause) {
        super(message, cause);
    }
}
