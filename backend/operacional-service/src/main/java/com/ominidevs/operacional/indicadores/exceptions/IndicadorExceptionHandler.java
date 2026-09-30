package com.ominidevs.operacional.indicadores.exceptions;

import java.util.Map;
import org.springframework.dao.DataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.*;
import com.ominidevs.operacional.indicadores.controllers.UtilizacaoController;

@RestControllerAdvice(assignableTypes = UtilizacaoController.class)
public class IndicadorExceptionHandler {
    private static final org.slf4j.Logger LOG =
            org.slf4j.LoggerFactory.getLogger(IndicadorExceptionHandler.class);

    @ExceptionHandler(IndicadorInvalidoException.class)
    public ResponseEntity<Map<String, String>> invalido(IndicadorInvalidoException ex) {
        return ResponseEntity.badRequest().body(Map.of("erro", ex.getMessage()));
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<Map<String, String>> ausente(MissingServletRequestParameterException ex) {
        return ResponseEntity.badRequest().body(Map.of("erro", "Informe dataInicio e dataFim no formato dd/MM/aaaa."));
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<Map<String, String>> indisponivel(DataAccessException ex) {
        LOG.error("Falha ao consultar o indicador de participação nas viagens", ex);
        return ResponseEntity.status(503).body(Map.of("erro",
                "Não foi possível consultar as viagens agora. Tente novamente em instantes."));
    }
}
