package com.ominidevs.operacional.importacao.entities;

/**
 * Origem de uma importação registrada no histórico.
 *
 * <p>O valor serializado é o nome do enum: a tela aceita tanto ele quanto a
 * forma em minúsculas nos parâmetros de consulta.
 */
public enum TipoImportacao {
    /** Planilha de manifesto, que gera as viagens. */
    MANIFESTO,
    /** Planilha de veículos da frota. */
    VEICULO;

    /**
     * Interpreta o valor vindo da query string sem exigir caixa exata
     * ("manifesto", "MANIFESTO", "Veiculo").
     *
     * @throws IllegalArgumentException quando o valor não é um tipo conhecido
     */
    public static TipoImportacao de(String valor) {
        return valueOf(valor.trim().toUpperCase(java.util.Locale.ROOT));
    }
}
