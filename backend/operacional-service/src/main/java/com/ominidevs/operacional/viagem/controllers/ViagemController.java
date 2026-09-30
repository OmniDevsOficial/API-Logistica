package com.ominidevs.operacional.viagem.controllers;

import com.ominidevs.operacional.viagem.entities.StatusViagem;
import com.ominidevs.operacional.viagem.entities.Viagem;
import com.ominidevs.operacional.viagem.services.ViagemService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

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

        List<Viagem> viagens =
                viagemService.importarManifesto(file);

        return ResponseEntity.ok(viagens);
    }

    @GetMapping
    public ResponseEntity<List<Viagem>> listar(
            @RequestParam(required = false) String destino,
            @RequestParam(required = false) List<StatusViagem> status,
            @RequestParam(required = false) BigDecimal freteMin,
            @RequestParam(required = false) BigDecimal freteMax,
            @RequestParam(required = false) String mes
    ) {

        List<Viagem> viagens =
                viagemService.filtrar(destino, status, freteMin, freteMax, mes);

        return ResponseEntity.ok(viagens);
    }
}