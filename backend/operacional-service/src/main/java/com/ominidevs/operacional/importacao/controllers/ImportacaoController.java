package com.ominidevs.operacional.importacao.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.ominidevs.operacional.importacao.dto.FiltroImportacao;
import com.ominidevs.operacional.importacao.dto.ImportacaoHistoricoResponse;
import com.ominidevs.operacional.importacao.entities.StatusImportacao;
import com.ominidevs.operacional.importacao.entities.TipoImportacao;
import com.ominidevs.operacional.importacao.services.ImportacaoHistoricoService;

/**
 * Histórico das importações de manifesto e de veículos, tela "Registros".
 *
 * <p>Exemplo: GET /api/operacional/importacoes?tipo=VEICULO&status=SUCESSO
 * &de=2026-11-01&ate=2026-11-17
 *
 * <p>Todos os parâmetros são opcionais e sem caixa exigida. A busca pelo nome
 * do arquivo fica na tela, sobre a lista já baixada.
 */
@RestController
@RequestMapping("/importacoes")
public class ImportacaoController {

    private final ImportacaoHistoricoService historico;

    public ImportacaoController(ImportacaoHistoricoService historico) {
        this.historico = historico;
    }

    @GetMapping
    public ResponseEntity<List<ImportacaoHistoricoResponse>> listar(
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate de,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ate) {

        return ResponseEntity.ok(historico.listar(new FiltroImportacao(
                converter(tipo, TipoImportacao::de, "tipo"),
                converter(status, StatusImportacao::de, "status"),
                de,
                ate)));
    }

    /**
     * Valida um parâmetro enumerado. Valor desconhecido responde 400 em vez
     * de 500, e parâmetro ausente continua significando "sem filtro".
     */
    private <T> T converter(String valor, java.util.function.Function<String, T> leitor, String parametro) {
        if (valor == null || valor.isBlank()) {
            return null;
        }
        try {
            return leitor.apply(valor);
        } catch (IllegalArgumentException excecao) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Valor inválido para o parâmetro \"" + parametro + "\".", excecao);
        }
    }
}
