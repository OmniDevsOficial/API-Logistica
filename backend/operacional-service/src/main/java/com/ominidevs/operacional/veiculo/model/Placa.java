package com.ominidevs.operacional.veiculo.model;

import java.util.Locale;
import java.util.regex.Pattern;

/**
 * Regras da placa de veículo, compartilhadas por todo o serviço.
 *
 * <p>A placa é gravada normalizada em {@code veiculo.placa}. Qualquer placa
 * vinda de fora (planilha, manifesto, filtro de tela) deve passar por
 * {@link #normalizar(String)} antes de ser comparada, por exemplo ao cruzar
 * {@code viagem.veiculo} com {@code veiculo.placa}.
 */
public final class Placa {

    /** Placa antiga (AAA9999) ou Mercosul (AAA9A99), já normalizada. */
    private static final Pattern PADRAO = Pattern.compile("[A-Z]{3}[0-9][A-Z0-9][0-9]{2}");

    private Placa() {
    }

    /**
     * Remove espaços e hífens e coloca em maiúsculas: {@code "abc-1d23"} vira
     * {@code "ABC1D23"}.
     *
     * @param valor placa em qualquer formato.
     * @return placa normalizada, ou {@code null} se vazia.
     */
    public static String normalizar(String valor) {
        if (valor == null) {
            return null;
        }
        String placa = valor.replaceAll("[\\s-]", "").toUpperCase(Locale.ROOT);
        return placa.isEmpty() ? null : placa;
    }

    /**
     * Indica se a placa normalizada segue o padrão antigo ou Mercosul.
     *
     * @param placaNormalizada placa já passada por {@link #normalizar(String)}.
     * @return {@code true} se a placa for válida.
     */
    public static boolean ehValida(String placaNormalizada) {
        return placaNormalizada != null && PADRAO.matcher(placaNormalizada).matches();
    }
}
