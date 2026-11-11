package com.ominidevs.operacional.dashboard.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ominidevs.operacional.dashboard.dto.DashboardResponse;
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
}
