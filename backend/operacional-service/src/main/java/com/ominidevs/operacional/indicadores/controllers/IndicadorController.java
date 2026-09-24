package com.ominidevs.operacional.indicadores.controllers;

import com.ominidevs.operacional.indicadores.dto.ViagensPorMotoristaDTO;
import com.ominidevs.operacional.indicadores.services.IndicadorService;
import com.ominidevs.operacional.viagem.entities.Viagem;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/indicadores")
public class IndicadorController {

    private final IndicadorService indicadorService;

    public IndicadorController(IndicadorService indicadorService) {
        this.indicadorService = indicadorService;
    }

    @GetMapping("/viagens-por-motorista")
    public ResponseEntity<List<ViagensPorMotoristaDTO>> viagensPorMotorista(
            @RequestParam(required = false) String periodo
    ) {

        List<ViagensPorMotoristaDTO> totais =
                indicadorService.contarViagensPorMotorista(periodo);

        return ResponseEntity.ok(totais);
    }

    @GetMapping("/viagens-por-motorista/{cpfMotorista}")
    public ResponseEntity<List<Viagem>> viagensDoMotorista(
            @PathVariable String cpfMotorista,
            @RequestParam(required = false) String periodo
    ) {

        List<Viagem> viagens =
                indicadorService.listarViagensDoMotorista(cpfMotorista, periodo);

        return ResponseEntity.ok(viagens);
    }
}
