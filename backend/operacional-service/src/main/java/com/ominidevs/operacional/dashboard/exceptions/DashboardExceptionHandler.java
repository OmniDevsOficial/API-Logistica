package com.ominidevs.operacional.dashboard.exceptions;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.ominidevs.operacional.dashboard.controllers.DashboardController;
import com.ominidevs.operacional.indicadores.exceptions.IndicadorInvalidoException;

@RestControllerAdvice(assignableTypes = DashboardController.class)
public class DashboardExceptionHandler {

    private static final Logger LOG = LoggerFactory.getLogger(DashboardExceptionHandler.class);

    @ExceptionHandler(IndicadorInvalidoException.class)
    public ResponseEntity<Map<String, String>> invalido(IndicadorInvalidoException ex) {
        return ResponseEntity.badRequest().body(Map.of("erro", ex.getMessage()));
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<Map<String, String>> ausente(MissingServletRequestParameterException ex) {
        return ResponseEntity.badRequest().body(Map.of("erro",
                "Informe dataInicio e dataFim no formato dd/MM/aaaa."));
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<Map<String, String>> indisponivel(DataAccessException ex) {
        LOG.error("Falha ao consultar os dados do dashboard", ex);
        return ResponseEntity.status(503).body(Map.of("erro",
                "Não foi possível carregar o dashboard agora. Tente novamente em instantes."));
    }
}
