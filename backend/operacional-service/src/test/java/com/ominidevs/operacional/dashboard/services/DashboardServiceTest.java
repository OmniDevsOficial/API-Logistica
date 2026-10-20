package com.ominidevs.operacional.dashboard.services;

import java.math.BigDecimal;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.ominidevs.operacional.dashboard.projections.PontoSerie;
import com.ominidevs.operacional.dashboard.projections.ResumoViagens;
import com.ominidevs.operacional.dashboard.projections.ValoresFinanceirosViagem;
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
            new ResumoViagens(0, null, null, 0, 0, 0, 0, 0);

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
                10, new BigDecimal("200.000000000000"),
                550L, 3, 2, 4, 3, 3));
        when(repository.consultarValoresFinanceiros(periodo)).thenReturn(List.of(
                new ValoresFinanceirosViagem(new BigDecimal("2000.00"), null, null)));
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
    void calculaRentabilidadeDoDashboardComValoresFinanceiros() {
        when(repository.consultarResumo(periodo)).thenReturn(new ResumoViagens(
                2, null, null, 2, 0, 0, 0, 2));
        when(repository.consultarValoresFinanceiros(periodo)).thenReturn(List.of(
                new ValoresFinanceirosViagem(new BigDecimal("3855.60"), new BigDecimal("2169.73"), new BigDecimal("69.47")),
                new ValoresFinanceirosViagem(new BigDecimal("2120.58"), new BigDecimal("2129.70"), new BigDecimal("165.87"))));

        var metricas = service.consultar(periodo).metricas();

        assertEquals(new BigDecimal("4534.77"), metricas.custoTotal());
        assertEquals(new BigDecimal("1441.41"), metricas.rentabilidadeTotal());
        assertEquals(new BigDecimal("720.71"), metricas.rentabilidadeMedia());
    }

    @Test
    void custoTotalSomaFreteEPedagioDeTodasAsViagensContandoCampoVazioComoZero() {
        when(repository.consultarValoresFinanceiros(periodo)).thenReturn(List.of(
                new ValoresFinanceirosViagem(new BigDecimal("1000.00"), new BigDecimal("600.00"), new BigDecimal("40.00")),
                new ValoresFinanceirosViagem(null, new BigDecimal("300.00"), new BigDecimal("10.00")),
                new ValoresFinanceirosViagem(new BigDecimal("500.00"), new BigDecimal("200.00"), null),
                new ValoresFinanceirosViagem(new BigDecimal("400.00"), null, null)));

        var metricas = service.consultar(periodo).metricas();

        assertEquals(new BigDecimal("1150.00"), metricas.custoTotal());
    }

    @Test
    void custoMedioDivideOCustoTotalPeloTotalDeViagensDoPeriodo() {
        when(repository.consultarResumo(periodo)).thenReturn(new ResumoViagens(
                3, null, null, 2, 0, 0, 0, 3));
        when(repository.consultarValoresFinanceiros(periodo)).thenReturn(List.of(
                new ValoresFinanceirosViagem(new BigDecimal("1000.00"), new BigDecimal("600.00"), new BigDecimal("40.00")),
                new ValoresFinanceirosViagem(null, new BigDecimal("300.00"), null),
                new ValoresFinanceirosViagem(new BigDecimal("400.00"), null, null)));

        var metricas = service.consultar(periodo).metricas();

        assertEquals(new BigDecimal("940.00"), metricas.custoTotal());
        assertEquals(new BigDecimal("313.33"), metricas.custoMedio());
    }

    @Test
    void rentabilidadeTotalSubtraiOCustoTotalDaReceitaDeTodasAsViagensContandoCampoVazioComoZero() {
        when(repository.consultarValoresFinanceiros(periodo)).thenReturn(List.of(
                new ValoresFinanceirosViagem(new BigDecimal("1000.00"), new BigDecimal("600.00"), new BigDecimal("40.00")),
                new ValoresFinanceirosViagem(null, new BigDecimal("300.00"), null),
                new ValoresFinanceirosViagem(new BigDecimal("400.00"), null, null)));

        var metricas = service.consultar(periodo).metricas();

        assertEquals(new BigDecimal("460.00"), metricas.rentabilidadeTotal());
    }

    @Test
    void rentabilidadeTotalPodeSerNegativaQuandoOCustoPassaAReceita() {
        when(repository.consultarValoresFinanceiros(periodo)).thenReturn(List.of(
                new ValoresFinanceirosViagem(new BigDecimal("500.00"), new BigDecimal("700.00"), new BigDecimal("50.00"))));

        var metricas = service.consultar(periodo).metricas();

        assertEquals(new BigDecimal("-250.00"), metricas.rentabilidadeTotal());
    }

    @Test
    void rentabilidadeMediaDivideARentabilidadeTotalPeloTotalDeViagensDoPeriodo() {
        when(repository.consultarResumo(periodo)).thenReturn(new ResumoViagens(
                3, null, null, 2, 0, 0, 0, 3));
        when(repository.consultarValoresFinanceiros(periodo)).thenReturn(List.of(
                new ValoresFinanceirosViagem(new BigDecimal("1000.00"), new BigDecimal("600.00"), new BigDecimal("40.00")),
                new ValoresFinanceirosViagem(null, new BigDecimal("300.00"), null),
                new ValoresFinanceirosViagem(new BigDecimal("400.00"), null, null)));

        var metricas = service.consultar(periodo).metricas();

        assertEquals(new BigDecimal("460.00"), metricas.rentabilidadeTotal());
        assertEquals(new BigDecimal("153.33"), metricas.rentabilidadeMedia());
    }

    @Test
    void valorDosFretesSomaAReceitaDeTodasAsViagensIgnorandoReceitaVazia() {
        when(repository.consultarValoresFinanceiros(periodo)).thenReturn(List.of(
                new ValoresFinanceirosViagem(new BigDecimal("1000.00"), new BigDecimal("600.00"), new BigDecimal("40.00")),
                new ValoresFinanceirosViagem(null, new BigDecimal("300.00"), null),
                new ValoresFinanceirosViagem(new BigDecimal("400.00"), null, null)));

        var metricas = service.consultar(periodo).metricas();

        assertEquals(new BigDecimal("1400.00"), metricas.freteTotal());
    }

    @Test
    void valorDosFretesFicaNuloQuandoNenhumaViagemTemReceita() {
        when(repository.consultarValoresFinanceiros(periodo)).thenReturn(List.of(
                new ValoresFinanceirosViagem(null, new BigDecimal("300.00"), new BigDecimal("10.00"))));

        var metricas = service.consultar(periodo).metricas();

        assertNull(metricas.freteTotal());
    }

    @Test
    void margemDivideARentabilidadeTotalPeloValorDosFretesEmPorcentagem() {
        when(repository.consultarValoresFinanceiros(periodo)).thenReturn(List.of(
                new ValoresFinanceirosViagem(new BigDecimal("1000.00"), new BigDecimal("600.00"), new BigDecimal("40.00")),
                new ValoresFinanceirosViagem(null, new BigDecimal("300.00"), null),
                new ValoresFinanceirosViagem(new BigDecimal("400.00"), null, null)));

        var metricas = service.consultar(periodo).metricas();

        assertEquals(new BigDecimal("32.86"), metricas.margem());
    }

    @Test
    void margemFicaNegativaQuandoOCustoPassaAReceita() {
        when(repository.consultarValoresFinanceiros(periodo)).thenReturn(List.of(
                new ValoresFinanceirosViagem(new BigDecimal("500.00"), new BigDecimal("700.00"), new BigDecimal("50.00"))));

        var metricas = service.consultar(periodo).metricas();

        assertEquals(new BigDecimal("-50.00"), metricas.margem());
    }

    @Test
    void margemFicaNulaSemValorDosFretesParaDividir() {
        when(repository.consultarValoresFinanceiros(periodo)).thenReturn(List.of(
                new ValoresFinanceirosViagem(null, new BigDecimal("300.00"), new BigDecimal("10.00")),
                new ValoresFinanceirosViagem(new BigDecimal("0.00"), new BigDecimal("100.00"), null)));

        var metricas = service.consultar(periodo).metricas();

        assertNull(metricas.margem());
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
