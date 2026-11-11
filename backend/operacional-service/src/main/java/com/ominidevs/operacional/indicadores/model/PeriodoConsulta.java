package com.ominidevs.operacional.indicadores.model;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.format.ResolverStyle;
import com.ominidevs.operacional.indicadores.exceptions.IndicadorInvalidoException;

public record PeriodoConsulta(LocalDate inicio, LocalDate fim) {
    public static final DateTimeFormatter FORMATO =
            DateTimeFormatter.ofPattern("dd/MM/uuuu").withResolverStyle(ResolverStyle.STRICT);

    public static final DateTimeFormatter FORMATO_MES =
            DateTimeFormatter.ofPattern("uuuu-MM").withResolverStyle(ResolverStyle.STRICT);

    public PeriodoConsulta {
        if (inicio == null || fim == null || inicio.isAfter(fim)) {
            throw new IndicadorInvalidoException("A data inicial deve ser anterior ou igual à data final.");
        }
    }

    public static PeriodoConsulta parse(String inicio, String fim) {
        try {
            return new PeriodoConsulta(LocalDate.parse(inicio, FORMATO), LocalDate.parse(fim, FORMATO));
        } catch (java.time.format.DateTimeParseException | NullPointerException e) {
            throw new IndicadorInvalidoException("Informe datas válidas no formato dd/MM/aaaa.");
        }
    }

    public static PeriodoConsulta mesCorrente() {
        LocalDate hoje = LocalDate.now();
        return new PeriodoConsulta(hoje.withDayOfMonth(1), hoje);
    }

    public static PeriodoConsulta doMes(String mes) {
        if (mes == null || mes.isBlank()) return doMes(YearMonth.now());
        try {
            return doMes(YearMonth.parse(mes.trim(), FORMATO_MES));
        } catch (DateTimeParseException e) {
            throw new IndicadorInvalidoException("Informe o mês no formato AAAA-MM.");
        }
    }

    private static PeriodoConsulta doMes(YearMonth mes) {
        return new PeriodoConsulta(mes.atDay(1), mes.atEndOfMonth());
    }
}
