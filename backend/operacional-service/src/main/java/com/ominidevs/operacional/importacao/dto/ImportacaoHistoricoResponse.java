package com.ominidevs.operacional.importacao.dto;

import java.time.OffsetDateTime;

import com.ominidevs.operacional.importacao.entities.StatusImportacao;
import com.ominidevs.operacional.importacao.entities.TipoImportacao;
import com.ominidevs.operacional.importacao.entities.ImportacaoHistorico;

/**
 * Linha do histórico de importações devolvida para a tela "Registros".
 *
 * <p>A chave da linha na tela é tipo + id: como os dois tipos vêm de consultas
 * separadas, o id sozinho não identifica a linha de forma inequívoca para o
 * front.
 *
 * @param id identificador dentro do histórico
 * @param tipo MANIFESTO ou VEICULO
 * @param dataHora momento em que a importação terminou
 * @param arquivo nome do arquivo enviado
 * @param usuario nome de quem enviou, quando conhecido
 * @param status SUCESSO, PARCIAL ou ERRO
 * @param resumo criados / atualizados / ignorados / rejeitados
 * @param reimportacaoDe data/hora da importação anterior do mesmo arquivo
 */
public record ImportacaoHistoricoResponse(
        Long id,
        TipoImportacao tipo,
        OffsetDateTime dataHora,
        String arquivo,
        String usuario,
        StatusImportacao status,
        ResumoImportacao resumo,
        OffsetDateTime reimportacaoDe) {

    public static ImportacaoHistoricoResponse de(ImportacaoHistorico historico) {
        return new ImportacaoHistoricoResponse(
                historico.getId(),
                historico.getTipo(),
                historico.getDataHora(),
                historico.getArquivo(),
                historico.getUsuario(),
                historico.getStatus(),
                new ResumoImportacao(
                        historico.getCriados(),
                        historico.getAtualizados(),
                        historico.getIgnorados(),
                        historico.getRejeitados()),
                historico.getReimportacaoDe());
    }
}
