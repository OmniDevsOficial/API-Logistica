package com.ominidevs.operacional.importacao.dto;

import java.time.LocalDate;

import com.ominidevs.operacional.importacao.entities.StatusImportacao;
import com.ominidevs.operacional.importacao.entities.TipoImportacao;

/**
 * Filtros de GET /importacoes. Todos opcionais; a busca pelo nome do arquivo
 * é feita na tela, sobre a lista já baixada.
 *
 * @param tipo MANIFESTO ou VEICULO
 * @param status SUCESSO, PARCIAL ou ERRO
 * @param de primeira data do período (inclusa)
 * @param ate última data do período (inclusa)
 */
public record FiltroImportacao(TipoImportacao tipo, StatusImportacao status, LocalDate de, LocalDate ate) {
    // Período invertido (ate antes de de) não é erro: a consulta simplesmente
    // não encontra nenhuma linha.
}
