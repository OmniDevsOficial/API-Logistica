package com.ominidevs.operacional.dashboard.model;

import org.junit.jupiter.api.Test;

import com.ominidevs.operacional.indicadores.model.PeriodoConsulta;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AgrupamentoSerieTest {

    @Test
    void periodoDeAteUmMesAgrupaPorDia() {
        assertEquals(AgrupamentoSerie.DIA, AgrupamentoSerie.para(PeriodoConsulta.parse("16/08/2026", "16/08/2026")));
        assertEquals(AgrupamentoSerie.DIA, AgrupamentoSerie.para(PeriodoConsulta.parse("01/02/2026", "28/02/2026")));
        assertEquals(AgrupamentoSerie.DIA, AgrupamentoSerie.para(PeriodoConsulta.parse("01/08/2026", "31/08/2026")));
    }

    @Test
    void periodoMaiorQueUmMesAgrupaPorMes() {
        assertEquals(AgrupamentoSerie.MES, AgrupamentoSerie.para(PeriodoConsulta.parse("01/08/2026", "01/09/2026")));
        assertEquals(AgrupamentoSerie.MES, AgrupamentoSerie.para(PeriodoConsulta.parse("01/01/2026", "31/12/2026")));
    }
}
