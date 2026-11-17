package com.ominidevs.operacional.importacao.entities;

/**
 * Origem de uma importação registrada no histórico.
 *
 * <p>O valor serializado é o nome do enum. Nos parâmetros de consulta a caixa
 * é livre ("manifesto", "MANIFESTO"), mas a grafia é uma só: o nome do enum,
 * sem plural — é o que a tela manda em {@code ?tipo=} após converter.
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
     * <p>O valor oficial é o nome do enum; a tela converte antes de montar a
     * requisição (ver {@code TIPO_API} no front), então o parâmetro chega aqui
     * sempre no formato {@code VEICULO}/{@code MANIFESTO}.
     *
     * @throws IllegalArgumentException quando o valor não é um tipo conhecido
     */
    public static TipoImportacao de(String valor) {
        return valueOf(valor.trim().toUpperCase(java.util.Locale.ROOT));
    }
}
