package com.ominidevs.operacional.viagem.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

/**
 * Trata filtros e falhas da integração de manifestos com corpo {"erro": "..."}.
 */
@RestControllerAdvice
public class ViagemExceptionHandler {

    @ExceptionHandler(IntegracaoManifestoException.class)
    public ResponseEntity<Map<String, String>> handleIntegracaoManifesto(IntegracaoManifestoException ex) {
        return ResponseEntity.status(ex.getStatus()).body(Map.of("erro", ex.getMessage()));
    }

    @ExceptionHandler(FiltroInvalidoException.class)
    public ResponseEntity<Map<String, String>> handleFiltroInvalido(FiltroInvalidoException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("erro", ex.getMessage()));
    }
}
