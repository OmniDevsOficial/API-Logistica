package com.ominidevs.operacional.viagem.controllers;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ominidevs.operacional.viagem.dto.RankingDestinoResponse;
import com.ominidevs.operacional.viagem.dto.RentabilidadeMotoristaResponse;
import com.ominidevs.operacional.viagem.dto.ViagemResponseDTO;
import com.ominidevs.operacional.viagem.dto.ImportacaoManifestoResponse;
import com.ominidevs.operacional.viagem.entities.StatusViagem;
import com.ominidevs.operacional.viagem.entities.Viagem;
import com.ominidevs.operacional.viagem.services.RentabilidadeService;
import com.ominidevs.operacional.viagem.services.ViagemService;
import com.ominidevs.operacional.indicadores.model.PeriodoConsulta;

@RestController
@RequestMapping("/viagens")
public class ViagemController {

    private final ViagemService viagemService;

    public ViagemController(ViagemService viagemService) {
        this.viagemService = viagemService;
    }

    @GetMapping("/{manifesto}/rentabilidade")
    public ResponseEntity<com.ominidevs.operacional.viagem.dto.RentabilidadeViagemResponse> rentabilidade(
            @org.springframework.web.bind.annotation.PathVariable String manifesto) {
        try {
            return ResponseEntity.ok(viagemService.consultarRentabilidade(manifesto));
        } catch (java.util.NoSuchElementException ex) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/rentabilidade/motoristas")
    public ResponseEntity<List<RentabilidadeMotoristaResponse>> rentabilidadePorMotorista(
            @RequestParam("dataInicio") String dataInicio,
            @RequestParam("dataFim") String dataFim) {
        PeriodoConsulta periodo = PeriodoConsulta.parse(dataInicio, dataFim);
        return ResponseEntity.ok(viagemService.rentabilidadeMediaPorMotorista(periodo.inicio(), periodo.fim()));
    }

    @PostMapping("/importar-manifesto")
    public ResponseEntity<ImportacaoManifestoResponse> importarManifesto(
            @RequestParam("file") MultipartFile file) {

        return ResponseEntity.ok(viagemService.importarManifesto(file));
    }

    /**
     * TOP 10 rotas por rentabilidade média no período. Exemplo de requisição:
     * GET /api/operacional/viagens/ranking-destinos?dataInicio=01/01/2026&dataFim=31/12/2026
     */
    @GetMapping("/ranking-destinos")
    public ResponseEntity<List<RankingDestinoResponse>> rankingDestinos(
            @RequestParam(required = false) String dataInicio,
            @RequestParam(required = false) String dataFim) {

        return ResponseEntity.ok(viagemService.rankingDestinosPorRentabilidade(dataInicio, dataFim));
    }

    /**
     * Busca e filtra viagens Exemplo de requisição: GET
     * /api/operacional/viagens?destino=São%20Paulo
     */
    @GetMapping
    public ResponseEntity<List<ViagemResponseDTO>> listar(
            @RequestParam(required = false) String destino,
            @RequestParam(required = false) List<StatusViagem> status,
            @RequestParam(required = false) BigDecimal freteMin,
            @RequestParam(required = false) BigDecimal freteMax,
            @RequestParam(required = false) String mes) {
        List<Viagem> viagens = viagemService.filtrar(destino, status, freteMin, freteMax, mes);

        List<ViagemResponseDTO> response = viagens.stream()
                .map(this::toResponseDTO)
                .toList();

        return ResponseEntity.ok(response);
    }

    /**
     * Converte entidade Viagem para DTO de resposta. Calcula distância em km a
     * partir da diferença entre km chegada e km saída e já envia os valores
     * financeiros, evitando uma requisição de rentabilidade por viagem na tela.
     */
    private ViagemResponseDTO toResponseDTO(Viagem viagem) {

        Integer distanciaKm = null;

        if (viagem.getKmSaida() != null && viagem.getKmChegada() != null) {
            distanciaKm = viagem.getKmChegada() - viagem.getKmSaida();
        }

        return new ViagemResponseDTO(
                viagem.getId(),
                viagem.getManifesto(),
                viagem.getData(),
                viagem.getCidadeOrigem(),
                viagem.getCidadeDestino(),
                viagem.getValorFrete(),
                viagem.getVeiculo(),
                distanciaKm,
                viagem.getEstimativaDias(),
                converterStatusParaFrontend(viagem.getStatus()),
                viagem.getReceitaFrete(),
                viagem.getValeFrete(),
                RentabilidadeService.calcular(viagem.getReceitaFrete(), viagem.getValeFrete()));
    }

    private String converterStatusParaFrontend(StatusViagem status) {
        return switch (status) {
            case PENDENTE ->
                "pendente";
            case EM_TRANSITO ->
                "em_transito";
            case FINALIZADO ->
                "finalizado";
        };
    }
}
