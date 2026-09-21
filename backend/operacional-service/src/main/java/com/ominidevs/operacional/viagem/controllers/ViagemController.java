package com.ominidevs.operacional.viagem.controllers;

import com.ominidevs.operacional.viagem.entities.Viagem;
import com.ominidevs.operacional.viagem.services.ViagemService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
}