package com.ominidevs.operacional.dashboard.services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ominidevs.operacional.dashboard.dto.DashboardResponse;
import com.ominidevs.operacional.dashboard.dto.MetricasDashboardResponse;
import com.ominidevs.operacional.dashboard.dto.PontoSerieResponse;
import com.ominidevs.operacional.dashboard.dto.SeriesDashboardResponse;
import com.ominidevs.operacional.dashboard.dto.ViagensPorStatusResponse;
import com.ominidevs.operacional.dashboard.projections.PontoSerie;
import com.ominidevs.operacional.dashboard.projections.ResumoViagens;
import com.ominidevs.operacional.dashboard.repositories.DashboardRepository;
import com.ominidevs.operacional.indicadores.dto.UtilizacaoMotoristaResponse;
import com.ominidevs.operacional.indicadores.model.OrdenacaoUtilizacao;
import com.ominidevs.operacional.indicadores.model.PeriodoConsulta;
import com.ominidevs.operacional.indicadores.services.UtilizacaoService;

@Service
public class DashboardService {

    private static final BigDecimal SEM_FONTE_NO_BANCO = null;
    private static final String COM_DADOS = "COM_DADOS";
    private static final String SEM_DADOS = "SEM_DADOS";

    private final DashboardRepository repository;
    private final UtilizacaoService utilizacaoService;

    public DashboardService(DashboardRepository repository, UtilizacaoService utilizacaoService) {
        this.repository = repository;
        this.utilizacaoService = utilizacaoService;
    }

    public DashboardResponse consultar(PeriodoConsulta periodo) {
        ResumoViagens resumo = repository.consultarResumo(periodo);

        SeriesDashboardResponse series = new SeriesDashboardResponse(
                converterSerie(repository.consultarSerieMensal(periodo)),
                converterSerie(repository.consultarSeriePorVeiculo(periodo)));

        List<UtilizacaoMotoristaResponse> utilizacao =
                utilizacaoService.consultar(periodo, OrdenacaoUtilizacao.DESC).motoristas();

        return new DashboardResponse(
                periodo.inicio().format(PeriodoConsulta.FORMATO),
                periodo.fim().format(PeriodoConsulta.FORMATO),
                resumo.totalViagens() == 0 ? SEM_DADOS : COM_DADOS,
                converterMetricas(resumo),
                series,
                utilizacao);
    }

    private MetricasDashboardResponse converterMetricas(ResumoViagens resumo) {
        return new MetricasDashboardResponse(
                resumo.totalViagens(),
                arredondar(resumo.freteTotal()),
                arredondar(resumo.freteMedio()),
                resumo.kmTotal(),
                resumo.motoristasAtivos(),
                resumo.veiculosUtilizados(),
                new ViagensPorStatusResponse(
                        resumo.viagensPendentes(),
                        resumo.viagensEmTransito(),
                        resumo.viagensFinalizadas()),
                SEM_FONTE_NO_BANCO,
                SEM_FONTE_NO_BANCO,
                SEM_FONTE_NO_BANCO,
                SEM_FONTE_NO_BANCO,
                SEM_FONTE_NO_BANCO);
    }

    private List<PontoSerieResponse> converterSerie(List<PontoSerie> pontos) {
        return pontos.stream()
                .map(ponto -> new PontoSerieResponse(
                        ponto.rotulo(), ponto.viagens(), arredondar(ponto.freteTotal())))
                .toList();
    }

    private BigDecimal arredondar(BigDecimal valor) {
        return valor == null ? null : valor.setScale(2, RoundingMode.HALF_UP);
    }
}
