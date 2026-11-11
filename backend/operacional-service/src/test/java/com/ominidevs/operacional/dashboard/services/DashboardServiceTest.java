package com.ominidevs.operacional.dashboard.services;

import java.math.BigDecimal;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.ominidevs.operacional.dashboard.projections.DestinoRentavel;
import com.ominidevs.operacional.dashboard.model.AgrupamentoSerie;
import com.ominidevs.operacional.dashboard.projections.PontoRentabilidade;
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
            new ResumoViagens(0, null, 0, 0, 0, 0, 0);

    @BeforeEach
    void configurar() {
        when(repository.consultarResumo(any())).thenReturn(RESUMO_VAZIO);
        when(repository.consultarSerieRentabilidade(any(), any())).thenReturn(List.of());
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
                10, 550L, 3, 2, 4, 3, 3));
        when(repository.consultarValoresFinanceiros(periodo)).thenReturn(List.of(
                new ValoresFinanceirosViagem(new BigDecimal("2000.00"), null)));
        when(repository.consultarSerieRentabilidade(periodo, AgrupamentoSerie.DIA)).thenReturn(List.of(
                new PontoRentabilidade("01/09", 10, BigDecimal.ZERO, new BigDecimal("2000.00"))));
        when(repository.consultarSeriePorVeiculo(periodo)).thenReturn(List.of(
                new PontoSerie("Truck", 6, new BigDecimal("1200.00")),
                new PontoSerie("SEM_VEICULO", 4, new BigDecimal("800.00"))));
        when(utilizacaoService.consultar(periodo, OrdenacaoUtilizacao.DESC)).thenReturn(utilizacao(
                List.of(new UtilizacaoMotoristaResponse("00123456789", 1, "Ana", 6,
                        new BigDecimal("60.00"), "COM_VIAGENS", false))));

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
        assertEquals(List.of("01/09"), resultado.series().rentabilidadePorPeriodo().pontos().stream().map(p -> p.rotulo()).toList());
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
    }

    @Test
    void calculaRentabilidadeDoDashboardComValoresFinanceiros() {
        when(repository.consultarResumo(periodo)).thenReturn(new ResumoViagens(
                2, null, 2, 0, 0, 0, 2));
        when(repository.consultarValoresFinanceiros(periodo)).thenReturn(List.of(
                new ValoresFinanceirosViagem(new BigDecimal("3855.60"), new BigDecimal("3059.20")),
                new ValoresFinanceirosViagem(new BigDecimal("2120.58"), new BigDecimal("2715.57"))));

        var metricas = service.consultar(periodo).metricas();

        assertEquals(new BigDecimal("5774.77"), metricas.custoTotal());
        assertEquals(new BigDecimal("201.41"), metricas.rentabilidadeTotal());
        assertEquals(new BigDecimal("100.71"), metricas.rentabilidadeMedia());
    }

    @Test
    void custoTotalSomaOValeFreteDasViagensIgnorandoValeFreteVazio() {
        when(repository.consultarValoresFinanceiros(periodo)).thenReturn(List.of(
                new ValoresFinanceirosViagem(new BigDecimal("1000.00"), new BigDecimal("640.00")),
                new ValoresFinanceirosViagem(null, new BigDecimal("310.00")),
                new ValoresFinanceirosViagem(new BigDecimal("500.00"), new BigDecimal("200.00")),
                new ValoresFinanceirosViagem(new BigDecimal("400.00"), null)));

        var metricas = service.consultar(periodo).metricas();

        assertEquals(new BigDecimal("1150.00"), metricas.custoTotal());
    }

    @Test
    void custoMedioDivideOCustoTotalPeloTotalDeViagensDoPeriodo() {
        when(repository.consultarResumo(periodo)).thenReturn(new ResumoViagens(
                3, null, 2, 0, 0, 0, 3));
        when(repository.consultarValoresFinanceiros(periodo)).thenReturn(List.of(
                new ValoresFinanceirosViagem(new BigDecimal("1000.00"), new BigDecimal("640.00")),
                new ValoresFinanceirosViagem(null, new BigDecimal("300.00")),
                new ValoresFinanceirosViagem(new BigDecimal("400.00"), null)));

        var metricas = service.consultar(periodo).metricas();

        assertEquals(new BigDecimal("940.00"), metricas.custoTotal());
        assertEquals(new BigDecimal("313.33"), metricas.custoMedio());
    }

    @Test
    void rentabilidadeTotalSubtraiOCustoTotalDaReceitaDeTodasAsViagensContandoCampoVazioComoZero() {
        when(repository.consultarValoresFinanceiros(periodo)).thenReturn(List.of(
                new ValoresFinanceirosViagem(new BigDecimal("1000.00"), new BigDecimal("640.00")),
                new ValoresFinanceirosViagem(null, new BigDecimal("300.00")),
                new ValoresFinanceirosViagem(new BigDecimal("400.00"), null)));

        var metricas = service.consultar(periodo).metricas();

        assertEquals(new BigDecimal("460.00"), metricas.rentabilidadeTotal());
    }

    @Test
    void rentabilidadeTotalPodeSerNegativaQuandoOCustoPassaAReceita() {
        when(repository.consultarValoresFinanceiros(periodo)).thenReturn(List.of(
                new ValoresFinanceirosViagem(new BigDecimal("500.00"), new BigDecimal("750.00"))));

        var metricas = service.consultar(periodo).metricas();

        assertEquals(new BigDecimal("-250.00"), metricas.rentabilidadeTotal());
    }

    @Test
    void rentabilidadeMediaDivideARentabilidadeTotalPeloTotalDeViagensDoPeriodo() {
        when(repository.consultarResumo(periodo)).thenReturn(new ResumoViagens(
                3, null, 2, 0, 0, 0, 3));
        when(repository.consultarValoresFinanceiros(periodo)).thenReturn(List.of(
                new ValoresFinanceirosViagem(new BigDecimal("1000.00"), new BigDecimal("640.00")),
                new ValoresFinanceirosViagem(null, new BigDecimal("300.00")),
                new ValoresFinanceirosViagem(new BigDecimal("400.00"), null)));

        var metricas = service.consultar(periodo).metricas();

        assertEquals(new BigDecimal("460.00"), metricas.rentabilidadeTotal());
        assertEquals(new BigDecimal("153.33"), metricas.rentabilidadeMedia());
    }

    @Test
    void valorDosFretesSomaAReceitaDeTodasAsViagensIgnorandoReceitaVazia() {
        when(repository.consultarValoresFinanceiros(periodo)).thenReturn(List.of(
                new ValoresFinanceirosViagem(new BigDecimal("1000.00"), new BigDecimal("640.00")),
                new ValoresFinanceirosViagem(null, new BigDecimal("300.00")),
                new ValoresFinanceirosViagem(new BigDecimal("400.00"), null)));

        var metricas = service.consultar(periodo).metricas();

        assertEquals(new BigDecimal("1400.00"), metricas.freteTotal());
    }

    @Test
    void valorDosFretesFicaNuloQuandoNenhumaViagemTemReceita() {
        when(repository.consultarValoresFinanceiros(periodo)).thenReturn(List.of(
                new ValoresFinanceirosViagem(null, new BigDecimal("310.00"))));

        var metricas = service.consultar(periodo).metricas();

        assertNull(metricas.freteTotal());
    }

    @Test
    void margemDivideARentabilidadeTotalPeloValorDosFretesEmPorcentagem() {
        when(repository.consultarValoresFinanceiros(periodo)).thenReturn(List.of(
                new ValoresFinanceirosViagem(new BigDecimal("1000.00"), new BigDecimal("640.00")),
                new ValoresFinanceirosViagem(null, new BigDecimal("300.00")),
                new ValoresFinanceirosViagem(new BigDecimal("400.00"), null)));

        var metricas = service.consultar(periodo).metricas();

        assertEquals(new BigDecimal("32.86"), metricas.margem());
    }

    @Test
    void margemFicaNegativaQuandoOCustoPassaAReceita() {
        when(repository.consultarValoresFinanceiros(periodo)).thenReturn(List.of(
                new ValoresFinanceirosViagem(new BigDecimal("500.00"), new BigDecimal("750.00"))));

        var metricas = service.consultar(periodo).metricas();

        assertEquals(new BigDecimal("-50.00"), metricas.margem());
    }

    @Test
    void margemFicaNulaSemValorDosFretesParaDividir() {
        when(repository.consultarValoresFinanceiros(periodo)).thenReturn(List.of(
                new ValoresFinanceirosViagem(null, new BigDecimal("310.00")),
                new ValoresFinanceirosViagem(new BigDecimal("0.00"), new BigDecimal("100.00"))));

        var metricas = service.consultar(periodo).metricas();

        assertNull(metricas.margem());
    }

    @Test
    void viagensPorMotoristaDivideOTotalDeViagensPelosMotoristasEmOperacao() {
        when(repository.consultarResumo(periodo)).thenReturn(new ResumoViagens(
                629, null, 113, 0, 0, 0, 629));

        var metricas = service.consultar(periodo).metricas();

        assertEquals(new BigDecimal("5.57"), metricas.viagensPorMotorista());
    }

    @Test
    void viagensPorMotoristaFicaNuloSemMotoristasNoPeriodo() {
        var metricas = service.consultar(periodo).metricas();

        assertNull(metricas.viagensPorMotorista());
    }

    @Test
    void destinoMaisRentavelRepassaODestinoDoBancoComORendimentoArredondado() {
        when(repository.consultarDestinoMaisRentavel(periodo)).thenReturn(
                new DestinoRentavel("São Paulo", 266, new BigDecimal("440844.4900")));

        var destino = service.consultar(periodo).metricas().destinoMaisRentavel();

        assertEquals("São Paulo", destino.destino());
        assertEquals(266, destino.viagens());
        assertEquals(new BigDecimal("440844.49"), destino.rentabilidadeTotal());
    }

    @Test
    void destinoMaisRentavelFicaNuloQuandoOBancoNaoEncontraDestino() {
        assertNull(service.consultar(periodo).metricas().destinoMaisRentavel());
    }

    @Test
    void ticketMedioDivideOValorDosFretesPeloTotalDeViagensContandoReceitaVaziaComoZero() {
        when(repository.consultarResumo(periodo)).thenReturn(new ResumoViagens(
                3, null, 2, 0, 0, 0, 3));
        when(repository.consultarValoresFinanceiros(periodo)).thenReturn(List.of(
                new ValoresFinanceirosViagem(new BigDecimal("1000.00"), new BigDecimal("640.00")),
                new ValoresFinanceirosViagem(null, new BigDecimal("300.00")),
                new ValoresFinanceirosViagem(new BigDecimal("400.00"), null)));

        var metricas = service.consultar(periodo).metricas();

        assertEquals(new BigDecimal("466.67"), metricas.freteMedio());
    }

    @Test
    void ticketMedioFicaNuloQuandoNenhumaViagemTemReceita() {
        when(repository.consultarResumo(periodo)).thenReturn(new ResumoViagens(
                1, null, 1, 0, 0, 0, 1));
        when(repository.consultarValoresFinanceiros(periodo)).thenReturn(List.of(
                new ValoresFinanceirosViagem(null, new BigDecimal("310.00"))));

        assertNull(service.consultar(periodo).metricas().freteMedio());
    }

    @Test
    void serieDeRentabilidadeDoAnoVemPorMesComValorArredondado() {
        PeriodoConsulta ano = PeriodoConsulta.parse("01/01/2026", "31/12/2026");
        when(repository.consultarSerieRentabilidade(ano, AgrupamentoSerie.MES)).thenReturn(List.of(
                new PontoRentabilidade("07/2026", 629, new BigDecimal("711053.8100"), new BigDecimal("882523.6700")),
                new PontoRentabilidade("08/2026", 694, new BigDecimal("1027913.7600"), new BigDecimal("889035.3300"))));

        var serie = service.consultar(ano).series().rentabilidadePorPeriodo();

        assertEquals("MES", serie.agrupamento());
        assertEquals(List.of("07/2026", "08/2026"), serie.pontos().stream().map(p -> p.rotulo()).toList());
        assertEquals(629, serie.pontos().get(0).viagens());
        assertEquals(new BigDecimal("882523.67"), serie.pontos().get(0).rentabilidade());
        assertEquals(new BigDecimal("711053.81"), serie.pontos().get(0).custo());
    }

    @Test
    void serieDeRentabilidadeDoMesVemPorDia() {
        assertEquals("DIA", service.consultar(periodo).series().rentabilidadePorPeriodo().agrupamento());
    }

    @Test
    void periodoSemViagensRetornaSemDadosENaoZeraOsValores() {
        var resultado = service.consultar(periodo);

        assertEquals("SEM_DADOS", resultado.status());
        assertEquals(0, resultado.metricas().totalViagens());
        assertNull(resultado.metricas().freteTotal());
        assertNull(resultado.metricas().freteMedio());
        assertNull(resultado.metricas().kmTotal());
        assertTrue(resultado.series().rentabilidadePorPeriodo().pontos().isEmpty());
        assertTrue(resultado.series().porVeiculo().isEmpty());
        assertTrue(resultado.utilizacaoMotoristas().isEmpty());
    }

    @Test
    void repassaOPeriodoRecebidoParaOBancoEParaOsIndicadores() {
        service.consultar(periodo);

        verify(repository).consultarResumo(periodo);
        verify(repository).consultarSerieRentabilidade(periodo, AgrupamentoSerie.DIA);
        verify(repository).consultarSeriePorVeiculo(periodo);
        verify(utilizacaoService).consultar(periodo, OrdenacaoUtilizacao.DESC);
    }
}
