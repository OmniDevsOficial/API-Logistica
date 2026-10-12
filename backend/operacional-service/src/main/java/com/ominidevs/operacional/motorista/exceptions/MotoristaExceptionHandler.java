package com.ominidevs.operacional.motorista.exceptions;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.ominidevs.operacional.indicadores.exceptions.IndicadorInvalidoException;
import com.ominidevs.operacional.motorista.controllers.MotoristaController;

@RestControllerAdvice(assignableTypes = MotoristaController.class)
public class MotoristaExceptionHandler {

    @ExceptionHandler(MotoristaNaoEncontradoException.class)
    public ResponseEntity<Map<String, String>> naoEncontrado(MotoristaNaoEncontradoException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("erro", ex.getMessage()));
    }

    @ExceptionHandler(StatusInvalidoException.class)
    public ResponseEntity<Map<String, String>> statusInvalido(StatusInvalidoException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("erro", ex.getMessage()));
    }

    @ExceptionHandler(IndicadorInvalidoException.class)
    public ResponseEntity<Map<String, String>> periodoInvalido(IndicadorInvalidoException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("erro", ex.getMessage()));
    }
}
