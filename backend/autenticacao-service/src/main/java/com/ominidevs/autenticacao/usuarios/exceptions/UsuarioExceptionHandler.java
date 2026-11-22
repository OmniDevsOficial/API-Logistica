package com.ominidevs.autenticacao.usuarios.exceptions;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.ominidevs.autenticacao.usuarios.controllers.UsuarioController;

@RestControllerAdvice(assignableTypes = UsuarioController.class)
@Order(Ordered.HIGHEST_PRECEDENCE)
public class UsuarioExceptionHandler {

    private static final Logger LOG = LoggerFactory.getLogger(UsuarioExceptionHandler.class);
    private static final String CAMPOS_INVALIDOS = "Campos inválidos.";
    private static final List<String> ORDEM_CAMPOS = List.of("nome", "email", "perfil", "senha", "ativo");
    private static final List<String> PRIORIDADE_REGRAS = List.of("NotBlank", "NotEmpty", "Size", "Pattern");

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> camposInvalidos(MethodArgumentNotValidException ex) {
        Map<String, String> campos = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.groupingBy(FieldError::getField)).entrySet().stream()
                .sorted(Comparator.comparingInt(entrada -> posicao(ORDEM_CAMPOS, entrada.getKey())))
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entrada -> mensagemPrioritaria(entrada.getValue()),
                        (primeira, segunda) -> primeira,
                        LinkedHashMap::new));
        return responderCampos(campos);
    }

    @ExceptionHandler(CamposInvalidosException.class)
    public ResponseEntity<Map<String, Object>> camposInvalidos(CamposInvalidosException ex) {
        return responderCampos(ex.getCampos());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> corpoInvalido(HttpMessageNotReadableException ex) {
        return ResponseEntity.badRequest().body(Map.of("erro", "Corpo da requisição inválido."));
    }

    @ExceptionHandler(EmailEmUsoException.class)
    public ResponseEntity<Map<String, Object>> emailEmUso(EmailEmUsoException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("erro", ex.getMessage()));
    }

    @ExceptionHandler(UsuarioNaoEncontradoException.class)
    public ResponseEntity<Map<String, Object>> naoEncontrado(UsuarioNaoEncontradoException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("erro", ex.getMessage()));
    }

    @ExceptionHandler(AutoDesativacaoException.class)
    public ResponseEntity<Map<String, Object>> autoDesativacao(AutoDesativacaoException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("erro", ex.getMessage()));
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<Map<String, Object>> indisponivel(DataAccessException ex) {
        LOG.error("Falha ao acessar os usuários no banco", ex);
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of("erro",
                "Não foi possível acessar os usuários agora. Tente novamente em instantes."));
    }

    private static ResponseEntity<Map<String, Object>> responderCampos(Map<String, String> campos) {
        Map<String, Object> corpo = new LinkedHashMap<>();
        corpo.put("erro", CAMPOS_INVALIDOS);
        corpo.put("campos", campos);
        return ResponseEntity.badRequest().body(corpo);
    }

    private static String mensagemPrioritaria(List<FieldError> erros) {
        return erros.stream()
                .min(Comparator.comparingInt(erro -> posicao(PRIORIDADE_REGRAS, erro.getCode())))
                .map(FieldError::getDefaultMessage)
                .orElse(CAMPOS_INVALIDOS);
    }

    private static int posicao(List<String> ordem, String valor) {
        int indice = ordem.indexOf(valor);
        return indice < 0 ? ordem.size() : indice;
    }
}
