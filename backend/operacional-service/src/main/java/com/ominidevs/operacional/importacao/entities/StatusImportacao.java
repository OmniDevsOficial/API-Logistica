package com.ominidevs.operacional.importacao.entities;

/**
 * Situação de uma importação registrada no histórico.
 */
public enum StatusImportacao {
    /** Todas as linhas aceitas. */
    SUCESSO,
    /** Algumas linhas foram gravadas e outras foram rejeitadas. */
    PARCIAL,
    /** Nada foi gravado: arquivo inválido, falha no serviço ou 100% rejeitado. */
    ERRO;

    /**
     * Interpreta o valor vindo da query string sem exigir caixa exata.
     *
     * @throws IllegalArgumentException quando o valor não é um status conhecido
     */
    public static StatusImportacao de(String valor) {
        return valueOf(valor.trim().toUpperCase(java.util.Locale.ROOT));
    }
}
