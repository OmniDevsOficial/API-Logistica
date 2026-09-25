package com.ominidevs.operacional.viagem.controllers;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ominidevs.operacional.viagem.dto.ViagemResponseDTO;
import com.ominidevs.operacional.viagem.entities.StatusViagem;
import com.ominidevs.operacional.viagem.entities.Viagem;
import com.ominidevs.operacional.viagem.services.ViagemService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/viagens")
public class ViagemController {

    private final ViagemService viagemService;

    public ViagemController(ViagemService viagemService) {
        this.viagemService = viagemService;
    }

    @PostMapping("/importar-manifesto")
    public ResponseEntity<List<Viagem>> importarManifesto(
            @RequestParam("file") MultipartFile file
    ) {

        List<Viagem> viagens
                = viagemService.importarManifesto(file);

        return ResponseEntity.ok(viagens);
    }

    @GetMapping
    public ResponseEntity<List<ViagemResponseDTO>> listar(
            @RequestParam(required = false) String destino,
            @RequestParam(required = false) List<StatusViagem> status,
            @RequestParam(required = false) BigDecimal freteMin,
            @RequestParam(required = false) BigDecimal freteMax,
            @RequestParam(required = false) String mes
    ) {
        List<Viagem> viagens
                = viagemService.filtrar(destino, status, freteMin, freteMax, mes);

        List<ViagemResponseDTO> response = viagens.stream()
                .map(this::toResponseDTO)
                .toList();

        return ResponseEntity.ok(response);
    }

    private ViagemResponseDTO toResponseDTO(Viagem viagem) {

        Integer distanciaKm = null;

        if (viagem.getKmSaida() != null && viagem.getKmChegada() != null) {
            distanciaKm = viagem.getKmChegada() - viagem.getKmSaida();
        }

        return new ViagemResponseDTO(
                viagem.getId(),
                "Não informado", // origem
                viagem.getCidadeDestino(),
                viagem.getValorFrete(),
                viagem.getVeiculo(),
                distanciaKm,
                null, // estimativaDias
                converterStatusParaFrontend(viagem.getStatus())
        );
    }

    private String converterStatusParaFrontend(StatusViagem status) {
        return switch (status) {
            case PENDENTE ->
                "disponivel";
            case EM_TRANSITO ->
                "confirmada";
            case FINALIZADO ->
                "concluida";
        };
    }
}
