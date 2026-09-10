package com.ominidevs.backend.manifesto;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * Controller REST para upload e processamento de manifestos.
 */
@RestController
@RequestMapping("/api/manifestos")
public class ManifestoController {

    private final ManifestoService manifestoService;

    public ManifestoController(ManifestoService manifestoService) {
        this.manifestoService = manifestoService;
    }

    /**
     * Recebe upload de arquivo .xlsx ou .csv e retorna o conteúdo
     * convertido em JSON genérico (List de Maps coluna → valor).
     *
     * @param file arquivo enviado via multipart/form-data
     * @return JSON com os dados tabulares do manifesto
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<Map<String, String>>> upload(@RequestParam("file") MultipartFile file) {
        List<Map<String, String>> dados = manifestoService.processarManifesto(file);
        return ResponseEntity.ok(dados);
    }
}
