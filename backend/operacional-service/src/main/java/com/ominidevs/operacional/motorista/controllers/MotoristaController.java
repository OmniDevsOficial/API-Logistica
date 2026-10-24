package com.ominidevs.operacional.motorista.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ominidevs.operacional.indicadores.dto.UtilizacaoMotoristaResponse;
import com.ominidevs.operacional.indicadores.model.PeriodoConsulta;
import com.ominidevs.operacional.indicadores.services.UtilizacaoService;
import com.ominidevs.operacional.motorista.dto.MotoristaResumoResponse;
import com.ominidevs.operacional.motorista.dto.MotoristaResponseDTO;
import com.ominidevs.operacional.motorista.dto.StatusMotoristaRequest;
import com.ominidevs.operacional.motorista.entities.StatusMotorista;
import com.ominidevs.operacional.motorista.services.MotoristaService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/motoristas")
public class MotoristaController {

    private final MotoristaService service;
    private final UtilizacaoService utilizacaoService;

    public MotoristaController(MotoristaService service, UtilizacaoService utilizacaoService) {
        this.service = service;
        this.utilizacaoService = utilizacaoService;
    }

    @GetMapping("/ping")
    public String ping() {
        return "operacional-service ativo";
    }

    @GetMapping
    public ResponseEntity<List<MotoristaResponseDTO>> listar(
            @RequestParam(required = false) String status
    ) {
        return ResponseEntity.ok(service.listar(filtroStatus(status)));
    }

    @GetMapping("/resumo")
    public ResponseEntity<MotoristaResumoResponse> resumo() {
        return ResponseEntity.ok(service.resumo());
    }

    @GetMapping("/baixa-utilizacao")
    public ResponseEntity<List<UtilizacaoMotoristaResponse>> baixaUtilizacao(
            @RequestParam(required = false) String mes
    ) {
        return ResponseEntity.ok(utilizacaoService.listarBaixaUtilizacao(PeriodoConsulta.doMes(mes)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<MotoristaResponseDTO> alterarStatus(
            @PathVariable Integer id,
            @RequestBody StatusMotoristaRequest request
    ) {
        StatusMotorista status = StatusMotorista.parse(request == null ? null : request.status());

        return ResponseEntity.ok(service.alterarStatus(id, status));
    }

    private StatusMotorista filtroStatus(String status) {
        return status == null || status.isBlank() ? null : StatusMotorista.parse(status);
    }
}
