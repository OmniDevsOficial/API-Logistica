package com.ominidevs.operacional.veiculo.exceptions;

import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import com.ominidevs.operacional.indicadores.exceptions.IndicadorInvalidoException;
import com.ominidevs.operacional.veiculo.controllers.VeiculoController;

/**
 * Traduz as falhas da importação de veículos para o corpo {"erro": "..."}.
 */
@RestControllerAdvice(assignableTypes = VeiculoController.class)
public class VeiculoExceptionHandler {

    @ExceptionHandler(ArquivoVeiculoInvalidoException.class)
    public ResponseEntity<Map<String, String>> arquivoInvalido(ArquivoVeiculoInvalidoException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("erro", ex.getMessage()));
    }

    @ExceptionHandler(ParametroFrotaInvalidoException.class)
    public ResponseEntity<Map<String, String>> parametroInvalido(ParametroFrotaInvalidoException ex) {
        return ResponseEntity.badRequest().body(Map.of("erro", ex.getMessage()));
    }

    @ExceptionHandler(IndicadorInvalidoException.class)
    public ResponseEntity<Map<String, String>> periodoInvalido(IndicadorInvalidoException ex) {
        return ResponseEntity.badRequest().body(Map.of("erro", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, String>> parametroNaoNumerico(MethodArgumentTypeMismatchException ex) {
        return ResponseEntity.badRequest().body(Map.of("erro", "O parâmetro " + ex.getName() + " é inválido."));
    }

    @ExceptionHandler(VeiculoNaoEncontradoException.class)
    public ResponseEntity<Map<String, String>> naoEncontrado(VeiculoNaoEncontradoException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("erro", ex.getMessage()));
    }

    /**
     * Duas importações simultâneas podem tentar cadastrar a mesma placa. A
     * transação inteira é desfeita, então reenviar o arquivo é seguro.
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> conflito(DataIntegrityViolationException ex) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(Map.of("erro",
                        "Outra importação alterou os mesmos veículos ao mesmo tempo. Envie o arquivo novamente."));
    }
}
