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
import com.ominidevs.operacional.dashboard.projections.ValoresFinanceirosViagem;
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
                converterMetricas(resumo, periodo),
                series,
                utilizacao);
    }

    private MetricasDashboardResponse converterMetricas(ResumoViagens resumo, PeriodoConsulta periodo) {
        var valores = repository.consultarValoresFinanceiros(periodo);
        if (valores == null) valores = List.of();
        BigDecimal custoTotal = somarCustos(valores);
        BigDecimal receitaTotal = somarReceitas(valores);
        BigDecimal rentabilidadeTotal = rentabilidade(receitaTotal, custoTotal);
        return new MetricasDashboardResponse(
                resumo.totalViagens(),
                arredondar(receitaTotal),
                arredondar(resumo.freteMedio()),
                resumo.kmTotal(),
                resumo.motoristasAtivos(),
                resumo.veiculosUtilizados(),
                new ViagensPorStatusResponse(
                        resumo.viagensPendentes(),
                        resumo.viagensEmTransito(),
                        resumo.viagensFinalizadas()),
                arredondar(custoTotal),
                mediaPorViagem(custoTotal, resumo.totalViagens()),
                arredondar(rentabilidadeTotal),
                mediaPorViagem(rentabilidadeTotal, resumo.totalViagens()),
                margem(rentabilidadeTotal, receitaTotal),
                SEM_FONTE_NO_BANCO);
    }

    private BigDecimal somarCustos(List<ValoresFinanceirosViagem> valores) {
        BigDecimal total = null;
        for (var v : valores) {
            if (v.custoFrete() == null && v.pedagio() == null) continue;
            BigDecimal base = total == null ? BigDecimal.ZERO : total;
            total = base.add(zeroSeNulo(v.custoFrete())).add(zeroSeNulo(v.pedagio()));
        }
        return total;
    }

    private BigDecimal somarReceitas(List<ValoresFinanceirosViagem> valores) {
        BigDecimal total = null;
        for (var v : valores) {
            if (v.receita() == null) continue;
            total = (total == null ? BigDecimal.ZERO : total).add(v.receita());
        }
        return total;
    }

    private BigDecimal rentabilidade(BigDecimal receitaTotal, BigDecimal custoTotal) {
        if (receitaTotal == null && custoTotal == null) return null;
        return zeroSeNulo(receitaTotal).subtract(zeroSeNulo(custoTotal));
    }

    private BigDecimal margem(BigDecimal rentabilidadeTotal, BigDecimal receitaTotal) {
        if (rentabilidadeTotal == null || receitaTotal == null || receitaTotal.signum() == 0) return null;
        return rentabilidadeTotal.multiply(BigDecimal.valueOf(100)).divide(receitaTotal, 2, RoundingMode.HALF_UP);
    }

    private BigDecimal mediaPorViagem(BigDecimal total, long totalViagens) {
        if (total == null || totalViagens == 0) return null;
        return total.divide(BigDecimal.valueOf(totalViagens), 2, RoundingMode.HALF_UP);
    }

    private BigDecimal zeroSeNulo(BigDecimal valor) {
        return valor == null ? BigDecimal.ZERO : valor;
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
