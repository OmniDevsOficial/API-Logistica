package com.ominidevs.operacional.dashboard.services;

import java.math.BigDecimal;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.ominidevs.operacional.dashboard.projections.PontoSerie;
import com.ominidevs.operacional.dashboard.projections.ResumoViagens;
import com.ominidevs.operacional.dashboard.repositories.DashboardRepository;
import com.ominidevs.operacional.indicadores.dto.UtilizacaoMotoristaResponse;
import com.ominidevs.operacional.indicadores.dto.UtilizacaoPeriodoResponse;
import com.ominidevs.operacional.indicadores.model.OrdenacaoUtilizacao;
import com.ominidevs.operacional.indicadores.model.PeriodoConsulta;
import com.ominidevs.operacional.indicadores.services.UtilizacaoService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class DashboardServiceTest {

    private final DashboardRepository repository = mock(DashboardRepository.class);
    private final UtilizacaoService utilizacaoService = mock(UtilizacaoService.class);
    private final DashboardService service = new DashboardService(repository, utilizacaoService);
    private final PeriodoConsulta periodo = PeriodoConsulta.parse("01/09/2026", "30/09/2026");

    private static final ResumoViagens RESUMO_VAZIO =
            new ResumoViagens(0, null, null, null, 0, 0, 0, 0, 0);

    @BeforeEach
    void configurar() {
        when(repository.consultarResumo(any())).thenReturn(RESUMO_VAZIO);
        when(repository.consultarSerieMensal(any())).thenReturn(List.of());
        when(repository.consultarSeriePorVeiculo(any())).thenReturn(List.of());
        when(utilizacaoService.consultar(any(), any())).thenReturn(utilizacao(List.of()));
    }

    private UtilizacaoPeriodoResponse utilizacao(List<UtilizacaoMotoristaResponse> motoristas) {
        return new UtilizacaoPeriodoResponse("01/09/2026", "30/09/2026",
                "PARTICIPACAO_NAS_VIAGENS", "desc", motoristas.size(),
                motoristas.isEmpty() ? "SEM_VIAGENS" : "COM_DADOS", motoristas);
    }

    @Test
    void montaContratoComResumoSeriesEUtilizacao() {
        when(repository.consultarResumo(periodo)).thenReturn(new ResumoViagens(
                10, new BigDecimal("2000.00"), new BigDecimal("200.000000000000"),
                550L, 3, 2, 4, 3, 3));
        when(repository.consultarSerieMensal(periodo)).thenReturn(List.of(
                new PontoSerie("09/2026", 10, new BigDecimal("2000.00"))));
        when(repository.consultarSeriePorVeiculo(periodo)).thenReturn(List.of(
                new PontoSerie("Truck", 6, new BigDecimal("1200.00")),
                new PontoSerie("SEM_VEICULO", 4, new BigDecimal("800.00"))));
        when(utilizacaoService.consultar(periodo, OrdenacaoUtilizacao.DESC)).thenReturn(utilizacao(
                List.of(new UtilizacaoMotoristaResponse("00123456789", 1, "Ana", 6,
                        new BigDecimal("60.00"), "COM_VIAGENS"))));

        var resultado = service.consultar(periodo);

        assertEquals("01/09/2026", resultado.dataInicio());
        assertEquals("30/09/2026", resultado.dataFim());
        assertEquals("COM_DADOS", resultado.status());
        assertEquals(10, resultado.metricas().totalViagens());
        assertEquals(new BigDecimal("2000.00"), resultado.metricas().freteTotal());
        assertEquals(new BigDecimal("200.00"), resultado.metricas().freteMedio());
        assertEquals(550L, resultado.metricas().kmTotal());
        assertEquals(3, resultado.metricas().motoristasAtivos());
        assertEquals(2, resultado.metricas().veiculosUtilizados());
        assertEquals(4, resultado.metricas().viagensPorStatus().pendente());
        assertEquals(3, resultado.metricas().viagensPorStatus().emTransito());
        assertEquals(3, resultado.metricas().viagensPorStatus().finalizado());
        assertEquals(List.of("09/2026"), resultado.series().porMes().stream().map(p -> p.rotulo()).toList());
        assertEquals(List.of("Truck", "SEM_VEICULO"),
                resultado.series().porVeiculo().stream().map(p -> p.rotulo()).toList());
        assertEquals(List.of("Ana"), resultado.utilizacaoMotoristas().stream().map(m -> m.nome()).toList());
    }

    @Test
    void camposSemFonteNoBancoContinuamNulos() {
        var metricas = service.consultar(periodo).metricas();

        assertNull(metricas.custoTotal());
        assertNull(metricas.custoMedio());
        assertNull(metricas.rentabilidadeTotal());
        assertNull(metricas.rentabilidadeMedia());
        assertNull(metricas.taxaOcupacao());
    }

    @Test
    void periodoSemViagensRetornaSemDadosENaoZeraOsValores() {
        var resultado = service.consultar(periodo);

        assertEquals("SEM_DADOS", resultado.status());
        assertEquals(0, resultado.metricas().totalViagens());
        assertNull(resultado.metricas().freteTotal());
        assertNull(resultado.metricas().freteMedio());
        assertNull(resultado.metricas().kmTotal());
        assertTrue(resultado.series().porMes().isEmpty());
        assertTrue(resultado.series().porVeiculo().isEmpty());
        assertTrue(resultado.utilizacaoMotoristas().isEmpty());
    }

    @Test
    void repassaOPeriodoRecebidoParaOBancoEParaOsIndicadores() {
        service.consultar(periodo);

        verify(repository).consultarResumo(periodo);
        verify(repository).consultarSerieMensal(periodo);
        verify(repository).consultarSeriePorVeiculo(periodo);
        verify(utilizacaoService).consultar(periodo, OrdenacaoUtilizacao.DESC);
    }
}
