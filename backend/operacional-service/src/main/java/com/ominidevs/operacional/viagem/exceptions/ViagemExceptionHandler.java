package com.ominidevs.operacional.viagem.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

/**
 * Trata os erros do filtro de viagens (GET /viagens) e retorna 400
 * com corpo {"erro": "..."} em vez de propagar como erro 500.
 */
@RestControllerAdvice
public class ViagemExceptionHandler {

    @ExceptionHandler(FiltroInvalidoException.class)
    public ResponseEntity<Map<String, String>> handleFiltroInvalido(FiltroInvalidoException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("erro", ex.getMessage()));
    }
}
