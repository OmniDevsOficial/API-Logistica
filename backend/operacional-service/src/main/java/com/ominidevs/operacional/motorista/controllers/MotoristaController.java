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
import com.ominidevs.operacional.indicadores.exceptions.IndicadorInvalidoException;
import com.ominidevs.operacional.indicadores.model.PeriodoConsulta;
import com.ominidevs.operacional.indicadores.services.UtilizacaoService;
import com.ominidevs.operacional.motorista.dto.MotoristaResumoResponse;
import com.ominidevs.operacional.motorista.dto.MotoristaResponseDTO;
import com.ominidevs.operacional.motorista.dto.PaginaHistoricoViagensResponse;
import com.ominidevs.operacional.motorista.dto.RankingMotoristaResponse;
import com.ominidevs.operacional.motorista.dto.StatusMotoristaRequest;
import com.ominidevs.operacional.motorista.entities.StatusMotorista;
import com.ominidevs.operacional.motorista.services.HistoricoViagemService;
import com.ominidevs.operacional.motorista.services.MotoristaService;
import com.ominidevs.operacional.motorista.services.RankingMotoristaService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/motoristas")
public class MotoristaController {

    private final MotoristaService service;
    private final UtilizacaoService utilizacaoService;
    private final RankingMotoristaService rankingService;
    private final HistoricoViagemService historicoService;

    public MotoristaController(
            MotoristaService service,
            UtilizacaoService utilizacaoService,
            RankingMotoristaService rankingService,
            HistoricoViagemService historicoService
    ) {
        this.service = service;
        this.utilizacaoService = utilizacaoService;
        this.rankingService = rankingService;
        this.historicoService = historicoService;
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

    /**
     * Ranking mensal de desempenho dos motoristas, restrito ao Gestor
     * (GET /motoristas/** exige ROLE_GESTOR na SegurancaConfig).
     *
     * O período pode vir como {@code mes=AAAA-MM} ou como
     * {@code dataInicio}/{@code dataFim} no formato dd/MM/aaaa (o formato que o
     * front da tela de ranking envia). Sem parâmetro, usa o mês atual.
     *
     * Ex.: GET /motoristas/ranking?mes=2026-02
     *      GET /motoristas/ranking?dataInicio=01/11/2026&dataFim=30/11/2026
     */
    @GetMapping("/ranking")
    public ResponseEntity<List<RankingMotoristaResponse>> ranking(
            @RequestParam(required = false) String mes,
            @RequestParam(required = false) String dataInicio,
            @RequestParam(required = false) String dataFim
    ) {
        return ResponseEntity.ok(rankingService.ranking(periodoRanking(mes, dataInicio, dataFim)));
    }

    @GetMapping("/{id}/viagens")
    public ResponseEntity<PaginaHistoricoViagensResponse> historicoViagens(
            @PathVariable Integer id,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int tamanho
    ) {
        return ResponseEntity.ok(historicoService.listar(id, pagina, tamanho));
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

    private PeriodoConsulta periodoRanking(String mes, String dataInicio, String dataFim) {
        boolean temDatas = presente(dataInicio) || presente(dataFim);

        if (presente(mes)) {
            if (temDatas) {
                throw new IndicadorInvalidoException(
                        "Informe mes ou dataInicio/dataFim, mas não os dois.");
            }
            return PeriodoConsulta.doMes(mes);
        }

        // Sem nenhum parâmetro, o mês atual (mesma regra de baixa-utilizacao).
        return temDatas ? PeriodoConsulta.parse(dataInicio, dataFim)
                : PeriodoConsulta.doMes((String) null);
    }

    private boolean presente(String valor) {
        return valor != null && !valor.isBlank();
    }
}
