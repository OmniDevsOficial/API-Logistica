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

    public MotoristaController(MotoristaService service) {
        this.service = service;
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
