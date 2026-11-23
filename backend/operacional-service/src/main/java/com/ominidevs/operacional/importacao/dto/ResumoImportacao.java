package com.ominidevs.operacional.importacao.dto;

import com.ominidevs.operacional.importacao.entities.StatusImportacao;

/**
 * Contagens de uma importação, o resumo exibido na coluna da tabela de
 * registros.
 *
 * <p>Toda linha do arquivo cai em exatamente um dos quatro campos: criada,
 * atualizada (já existia e mudou), ignorada (já existia e nada mudou) ou
 * rejeitada.
 *
 * @param criados registros gravados do zero
 * @param atualizados registros existentes que mudaram
 * @param ignorados registros existentes que já estavam como estavam
 * @param rejeitados linhas recusadas, nada delas foi gravado
 */
public record ResumoImportacao(int criados, int atualizados, int ignorados, int rejeitados) {

    public static final ResumoImportacao ZERO = new ResumoImportacao(0, 0, 0, 0);

    /**
     * Status derivado das contagens: nada gravado é ERRO; com alguma linha
     * rejeitada e gravação bem-sucedida é PARCIAL; o resto é SUCESSO.
     */
    public StatusImportacao status() {
        if (criados + atualizados + ignorados == 0) {
            return StatusImportacao.ERRO;
        }
        if (rejeitados > 0) {
            return StatusImportacao.PARCIAL;
        }
        return StatusImportacao.SUCESSO;
    }
}
