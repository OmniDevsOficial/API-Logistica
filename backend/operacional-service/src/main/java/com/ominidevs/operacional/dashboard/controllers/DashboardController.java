package com.ominidevs.operacional.dashboard.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ominidevs.operacional.dashboard.dto.DashboardResponse;
import com.ominidevs.operacional.dashboard.dto.PagamentoMotoristaResponse;
import com.ominidevs.operacional.dashboard.dto.RentabilidadePorTipoResponse;
import com.ominidevs.operacional.dashboard.services.DashboardService;
import com.ominidevs.operacional.indicadores.model.PeriodoConsulta;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final DashboardService service;

    public DashboardController(DashboardService service) {
        this.service = service;
    }

    @GetMapping
    public DashboardResponse consultar(
            @RequestParam("dataInicio") String dataInicio,
            @RequestParam("dataFim") String dataFim) {
        return service.consultar(PeriodoConsulta.parse(dataInicio, dataFim));
    }

    @GetMapping("/rentabilidade-por-tipo")
    public List<RentabilidadePorTipoResponse> rentabilidadePorTipo(@RequestParam("mes") String mes) {
        return service.rentabilidadePorTipo(PeriodoConsulta.doMesObrigatorio(mes));
    }

    /**
     * Pagamento consolidado por motorista no período. Restrito ao perfil GESTOR via
     * {@code /dashboard/**} em {@code SegurancaConfig}.
     *
     * @param mes        mês no formato AAAA-MM, usado quando não há datas.
     * @param dataInicio data inicial dd/MM/aaaa, junto com {@code dataFim}.
     * @param dataFim    data final dd/MM/aaaa, junto com {@code dataInicio}.
     * @return um item por motorista com nome, quantidade de viagens e valor a pagar.
     */
    @GetMapping("/pagamento-motoristas")
    public List<PagamentoMotoristaResponse> pagamentoMotoristas(
            @RequestParam(required = false) String mes,
            @RequestParam(required = false) String dataInicio,
            @RequestParam(required = false) String dataFim) {
        PeriodoConsulta periodo = dataInicio == null && dataFim == null
                ? PeriodoConsulta.doMesObrigatorio(mes)
                : PeriodoConsulta.parse(dataInicio, dataFim);
        return service.pagamentoMotoristas(periodo);
    }
}
