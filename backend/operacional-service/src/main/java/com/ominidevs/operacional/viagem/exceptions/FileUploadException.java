package com.ominidevs.operacional.viagem.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Trata uploads acima do limite multipart (10 MB). O Spring rejeita o arquivo
 * antes de chegar ao controller, por isso o tratamento é global.
 */
@RestControllerAdvice
public class FileUploadException {

    /**
     * Manifesto mantém o 413 já usado pelo front; a importação de veículos
     * responde 400, como pede a sua especificação.
     */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, String>> handleMaxUploadSize(
            MaxUploadSizeExceededException ex, HttpServletRequest request) {
        HttpStatus status = request.getRequestURI().contains("/veiculos/")
                ? HttpStatus.BAD_REQUEST
                : HttpStatus.PAYLOAD_TOO_LARGE;
        return ResponseEntity
                .status(status)
                .body(Map.of("erro", "O arquivo excede o tamanho máximo permitido (10MB)."));
    }
}
