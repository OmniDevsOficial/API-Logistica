package com.ominidevs.operacional.veiculo.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ominidevs.operacional.veiculo.dto.FiltroVeiculo;
import com.ominidevs.operacional.veiculo.dto.ImportacaoVeiculoResponse;
import com.ominidevs.operacional.veiculo.dto.VeiculoResponse;
import com.ominidevs.operacional.veiculo.services.ImportacaoVeiculoService;
import com.ominidevs.operacional.veiculo.services.VeiculoConsultaService;

/**
 * Veículos da frota. Consulta e importação: gestor e operador.
 */
@RestController
@RequestMapping("/veiculos")
public class VeiculoController {

    private final ImportacaoVeiculoService importacaoService;
    private final VeiculoConsultaService consultaService;

    public VeiculoController(
            ImportacaoVeiculoService importacaoService,
            VeiculoConsultaService consultaService
    ) {
        this.importacaoService = importacaoService;
        this.consultaService = consultaService;
    }

    /**
     * Lista veículos com filtros opcionais. Exemplo:
     * GET /api/operacional/veiculos?tipo=fiorino&ativo=true
     */
    @GetMapping
    public ResponseEntity<List<VeiculoResponse>> listar(
            @RequestParam(required = false) String placa,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) Integer motoristaId,
            @RequestParam(required = false) Boolean ativo) {
        return ResponseEntity.ok(consultaService.listar(new FiltroVeiculo(placa, tipo, motoristaId, ativo)));
    }

    /** Tipos cadastrados, para filtros. Exemplo: GET /api/operacional/veiculos/tipos */
    @GetMapping("/tipos")
    public ResponseEntity<List<String>> tipos() {
        return ResponseEntity.ok(consultaService.listarTipos());
    }

    /** Veículo pela placa, em qualquer formato. Exemplo: GET /api/operacional/veiculos/ABC-1D23 */
    @GetMapping("/{placa}")
    public ResponseEntity<VeiculoResponse> buscarPorPlaca(@PathVariable String placa) {
        return ResponseEntity.ok(consultaService.buscarPorPlaca(placa));
    }

    /**
     * Importa o CSV de veículos (gestor e operador). Exemplo:
     * POST /api/operacional/veiculos/importacao com multipart "file".
     *
     * <p>O campo é opcional aqui para que a ausência do arquivo responda 400
     * com a mesma mensagem clara de um arquivo vazio.
     */
    @PostMapping("/importacao")
    public ResponseEntity<ImportacaoVeiculoResponse> importar(
            @RequestParam(value = "file", required = false) MultipartFile file) {
        return ResponseEntity.ok(importacaoService.importar(file));
    }
}
