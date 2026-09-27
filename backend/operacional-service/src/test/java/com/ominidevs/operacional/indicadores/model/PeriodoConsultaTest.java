package com.ominidevs.operacional.indicadores.model;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import com.ominidevs.operacional.indicadores.exceptions.IndicadorInvalidoException;
import static org.junit.jupiter.api.Assertions.*;

class PeriodoConsultaTest {
    @Test void aceitaMesmoDia() {
        var p = PeriodoConsulta.parse("01/09/2026", "01/09/2026");
        assertEquals(p.inicio(), p.fim());
    }
    @Test void aceitaAnoBissexto() {
        assertEquals(29, PeriodoConsulta.parse("29/02/2024", "01/03/2024").inicio().getDayOfMonth());
    }
    @ParameterizedTest
    @ValueSource(strings = {"31/02/2026", "29/02/2026", "2026-09-01", "", "1/9/2026"})
    void rejeitaDatasInvalidas(String data) {
        assertThrows(IndicadorInvalidoException.class, () -> PeriodoConsulta.parse(data, "30/09/2026"));
    }
    @Test void rejeitaPeriodoInvertido() {
        assertThrows(IndicadorInvalidoException.class,
                () -> PeriodoConsulta.parse("10/09/2026", "01/09/2026"));
    }
    @Test void validaOrdenacao() {
        assertEquals(OrdenacaoUtilizacao.ASC, OrdenacaoUtilizacao.parse("asc"));
        assertEquals(OrdenacaoUtilizacao.DESC, OrdenacaoUtilizacao.parse("DESC"));
        assertThrows(IndicadorInvalidoException.class, () -> OrdenacaoUtilizacao.parse("invalida"));
    }
}
