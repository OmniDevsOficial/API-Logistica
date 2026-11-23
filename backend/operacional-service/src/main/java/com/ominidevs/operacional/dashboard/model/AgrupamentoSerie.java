package com.ominidevs.operacional.dashboard.model;

import java.time.temporal.ChronoUnit;

import com.ominidevs.operacional.indicadores.model.PeriodoConsulta;

public enum AgrupamentoSerie {
    DIA("day", "DD/MM"),
    MES("month", "MM/YYYY");

    private static final long MAIOR_PERIODO_POR_DIA = 31;

    private final String unidadeSql;
    private final String formatoRotulo;

    AgrupamentoSerie(String unidadeSql, String formatoRotulo) {
        this.unidadeSql = unidadeSql;
        this.formatoRotulo = formatoRotulo;
    }

    public static AgrupamentoSerie para(PeriodoConsulta periodo) {
        long dias = ChronoUnit.DAYS.between(periodo.inicio(), periodo.fim()) + 1;
        return dias <= MAIOR_PERIODO_POR_DIA ? DIA : MES;
    }

    public String unidadeSql() {
        return unidadeSql;
    }

    public String formatoRotulo() {
        return formatoRotulo;
    }
}
