package com.ominidevs.operacional.indicadores.model;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.ResolverStyle;
import com.ominidevs.operacional.indicadores.exceptions.IndicadorInvalidoException;

public record PeriodoConsulta(LocalDate inicio, LocalDate fim) {
    public static final DateTimeFormatter FORMATO =
            DateTimeFormatter.ofPattern("dd/MM/uuuu").withResolverStyle(ResolverStyle.STRICT);

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
}
