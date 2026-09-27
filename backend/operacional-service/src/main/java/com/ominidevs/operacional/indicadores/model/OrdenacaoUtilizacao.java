package com.ominidevs.operacional.indicadores.model;

import java.util.Locale;
import com.ominidevs.operacional.indicadores.exceptions.IndicadorInvalidoException;

public enum OrdenacaoUtilizacao {
    ASC, DESC;

    public static OrdenacaoUtilizacao parse(String valor) {
        if (valor == null) return DESC;
        try { return valueOf(valor.toUpperCase(Locale.ROOT)); }
        catch (IllegalArgumentException e) {
            throw new IndicadorInvalidoException("A ordenação deve ser asc ou desc.");
        }
    }

    public String parametro() { return name().toLowerCase(Locale.ROOT); }
}
