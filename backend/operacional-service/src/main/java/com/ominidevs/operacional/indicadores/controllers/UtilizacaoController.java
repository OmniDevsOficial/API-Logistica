package com.ominidevs.operacional.indicadores.controllers;

import org.springframework.web.bind.annotation.*;
import com.ominidevs.operacional.indicadores.dto.UtilizacaoPeriodoResponse;
import com.ominidevs.operacional.indicadores.model.*;
import com.ominidevs.operacional.indicadores.services.UtilizacaoService;

@RestController
@RequestMapping("/indicadores/utilizacao")
public class UtilizacaoController {
    private final UtilizacaoService service;

    public UtilizacaoController(UtilizacaoService service) { this.service = service; }

    @GetMapping
    public UtilizacaoPeriodoResponse consultar(
            @RequestParam("dataInicio") String dataInicio,
            @RequestParam("dataFim") String dataFim,
            @RequestParam(value = "ordenacao", defaultValue = "desc") String ordenacao,
            @RequestParam(value = "cpf", required = false) String cpf) {
        return service.consultar(PeriodoConsulta.parse(dataInicio, dataFim),
                OrdenacaoUtilizacao.parse(ordenacao), cpf);
    }
}
