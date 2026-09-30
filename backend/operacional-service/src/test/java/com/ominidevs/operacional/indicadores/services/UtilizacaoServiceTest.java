package com.ominidevs.operacional.indicadores.services;

import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;
import com.ominidevs.operacional.indicadores.model.*;
import com.ominidevs.operacional.indicadores.projections.MotoristaQuantidadeViagens;
import com.ominidevs.operacional.indicadores.repositories.UtilizacaoRepository;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UtilizacaoServiceTest {
    private final UtilizacaoRepository repo = mock(UtilizacaoRepository.class);
    private final UtilizacaoService service = new UtilizacaoService(repo);
    private final PeriodoConsulta periodo = PeriodoConsulta.parse("01/09/2026", "10/09/2026");

    private MotoristaQuantidadeViagens motorista(String chave, String nome, long quantidade) {
        return new MotoristaQuantidadeViagens(chave, null, nome, quantidade);
    }

    @Test void calculaParticipacaoEOrdenaDecrescenteIncluindoZero() {
        when(repo.consultar(periodo)).thenReturn(List.of(
                motorista("b", "Bruno", 6), motorista("d", "Daniel", 0),
                motorista("a", "Ana", 10), motorista("c", "Carlos", 4)));
        var resultado = service.consultar(periodo, OrdenacaoUtilizacao.DESC);
        assertEquals(20, resultado.totalViagens());
        assertEquals(List.of("Ana", "Bruno", "Carlos", "Daniel"),
                resultado.motoristas().stream().map(d -> d.nome()).toList());
        assertEquals(List.of(new BigDecimal("50.00"), new BigDecimal("30.00"),
                        new BigDecimal("20.00"), new BigDecimal("0.00")),
                resultado.motoristas().stream().map(d -> d.porcentagem()).toList());
        assertEquals("SEM_VIAGENS", resultado.motoristas().get(3).status());
        assertEquals("PARTICIPACAO_NAS_VIAGENS", resultado.tipoIndicador());
    }

    @Test void ordenaCrescenteComDesempateEstavel() {
        when(repo.consultar(periodo)).thenReturn(List.of(
                motorista("z", "Zelia", 2), motorista("a", "Ana", 2), motorista("b", "Bruno", 1)));
        assertEquals(List.of("Bruno", "Ana", "Zelia"),
                service.consultar(periodo, OrdenacaoUtilizacao.ASC).motoristas().stream().map(d -> d.nome()).toList());
    }

    @Test void periodoSemViagensRetornaZero() {
        when(repo.consultar(periodo)).thenReturn(List.of(motorista("a", "Ana", 0)));
        var resultado = service.consultar(periodo, OrdenacaoUtilizacao.DESC);
        assertEquals("SEM_VIAGENS", resultado.status());
        assertEquals(new BigDecimal("0.00"), resultado.motoristas().getFirst().porcentagem());
    }

    @Test void bancoSemMotoristasOuViagensRetornaListaVazia() {
        when(repo.consultar(periodo)).thenReturn(List.of());
        var resultado = service.consultar(periodo, OrdenacaoUtilizacao.DESC);
        assertEquals(0, resultado.totalViagens());
        assertEquals("SEM_VIAGENS", resultado.status());
        assertTrue(resultado.motoristas().isEmpty());
    }

    @Test void variasViagensNoMesmoDiaNaoUltrapassamCemPorCento() {
        var dia = PeriodoConsulta.parse("01/09/2026", "01/09/2026");
        when(repo.consultar(dia)).thenReturn(List.of(motorista("a", "Ana", 15)));
        var resultado = service.consultar(dia, OrdenacaoUtilizacao.DESC);
        assertEquals(15, resultado.totalViagens());
        assertEquals(new BigDecimal("100.00"), resultado.motoristas().getFirst().porcentagem());
    }

    @Test void recalculaCadaPeriodoESemCache() {
        var outro = PeriodoConsulta.parse("01/10/2026", "31/10/2026");
        when(repo.consultar(periodo)).thenReturn(List.of(motorista("a", "Ana", 1)));
        when(repo.consultar(outro)).thenReturn(List.of(motorista("a", "Ana", 1), motorista("b", "Bruno", 3)));
        assertEquals(new BigDecimal("100.00"), service.consultar(periodo, OrdenacaoUtilizacao.ASC)
                .motoristas().getFirst().porcentagem());
        assertEquals(new BigDecimal("25.00"), service.consultar(outro, OrdenacaoUtilizacao.ASC)
                .motoristas().getFirst().porcentagem());
        service.consultar(periodo, OrdenacaoUtilizacao.ASC);
        verify(repo, times(2)).consultar(periodo);
        verify(repo).consultar(outro);
    }

    @Test void incluiSemIdentificacaoNoDenominadorEArredonda() {
        when(repo.consultar(periodo)).thenReturn(List.of(motorista("a", "Ana", 1),
                motorista("SEM_IDENTIFICACAO", "Sem motorista identificado", 2)));
        var resultado = service.consultar(periodo, OrdenacaoUtilizacao.ASC);
        assertEquals(3, resultado.totalViagens());
        assertEquals(new BigDecimal("33.33"), resultado.motoristas().getFirst().porcentagem());
        assertEquals(new BigDecimal("66.67"), resultado.motoristas().getLast().porcentagem());
    }
}
