package com.ominidevs.operacional.dashboard.controllers;

import java.math.BigDecimal;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.ominidevs.operacional.dashboard.exceptions.DashboardExceptionHandler;
import com.ominidevs.operacional.dashboard.projections.PontoSerie;
import com.ominidevs.operacional.dashboard.projections.ResumoViagens;
import com.ominidevs.operacional.dashboard.repositories.DashboardRepository;
import com.ominidevs.operacional.dashboard.services.DashboardService;
import com.ominidevs.operacional.indicadores.projections.MotoristaQuantidadeViagens;
import com.ominidevs.operacional.indicadores.repositories.UtilizacaoRepository;
import com.ominidevs.operacional.indicadores.services.UtilizacaoService;

import static org.hamcrest.Matchers.nullValue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class DashboardControllerTest {

    private final DashboardRepository repository = mock(DashboardRepository.class);
    private final UtilizacaoRepository utilizacaoRepository = mock(UtilizacaoRepository.class);
    private MockMvc mvc;

    @BeforeEach
    void configurar() {
        when(repository.consultarResumo(any()))
                .thenReturn(new ResumoViagens(0, null, null, null, 0, 0, 0, 0, 0));
        when(repository.consultarSerieMensal(any())).thenReturn(List.of());
        when(repository.consultarSeriePorVeiculo(any())).thenReturn(List.of());
        when(utilizacaoRepository.consultar(any())).thenReturn(List.of());

        mvc = MockMvcBuilders
                .standaloneSetup(new DashboardController(
                        new DashboardService(repository, new UtilizacaoService(utilizacaoRepository))))
                .setControllerAdvice(new DashboardExceptionHandler())
                .build();
    }

    private org.springframework.test.web.servlet.ResultActions consultarSetembro() throws Exception {
        return mvc.perform(get("/dashboard")
                .param("dataInicio", "01/09/2026")
                .param("dataFim", "30/09/2026"));
    }

    @Test
    void retornaOContratoCompletoComDadosDoBanco() throws Exception {
        when(repository.consultarResumo(any())).thenReturn(new ResumoViagens(
                4, new BigDecimal("2000.00"), new BigDecimal("500.000000000000"),
                550L, 2, 1, 2, 1, 1));
        when(repository.consultarSerieMensal(any())).thenReturn(List.of(
                new PontoSerie("09/2026", 4, new BigDecimal("2000.00"))));
        when(repository.consultarSeriePorVeiculo(any())).thenReturn(List.of(
                new PontoSerie("Truck", 4, new BigDecimal("2000.00"))));
        when(utilizacaoRepository.consultar(any())).thenReturn(List.of(
                new MotoristaQuantidadeViagens("00123456789", 1, "Ana", 4)));

        consultarSetembro()
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dataInicio").value("01/09/2026"))
                .andExpect(jsonPath("$.dataFim").value("30/09/2026"))
                .andExpect(jsonPath("$.status").value("COM_DADOS"))
                .andExpect(jsonPath("$.metricas.totalViagens").value(4))
                .andExpect(jsonPath("$.metricas.freteTotal").value(2000.00))
                .andExpect(jsonPath("$.metricas.freteMedio").value(500.00))
                .andExpect(jsonPath("$.metricas.kmTotal").value(550))
                .andExpect(jsonPath("$.metricas.motoristasAtivos").value(2))
                .andExpect(jsonPath("$.metricas.veiculosUtilizados").value(1))
                .andExpect(jsonPath("$.metricas.viagensPorStatus.pendente").value(2))
                .andExpect(jsonPath("$.metricas.viagensPorStatus.emTransito").value(1))
                .andExpect(jsonPath("$.metricas.viagensPorStatus.finalizado").value(1))
                .andExpect(jsonPath("$.series.porMes[0].rotulo").value("09/2026"))
                .andExpect(jsonPath("$.series.porMes[0].viagens").value(4))
                .andExpect(jsonPath("$.series.porVeiculo[0].rotulo").value("Truck"))
                .andExpect(jsonPath("$.utilizacaoMotoristas[0].nome").value("Ana"))
                .andExpect(jsonPath("$.utilizacaoMotoristas[0].porcentagem").value(100));
    }

    @Test
    void mantemOsCardsSemFonteComoNulosNoJson() throws Exception {
        consultarSetembro()
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.metricas.custoTotal").value(nullValue()))
                .andExpect(jsonPath("$.metricas.custoMedio").value(nullValue()))
                .andExpect(jsonPath("$.metricas.rentabilidadeTotal").value(nullValue()))
                .andExpect(jsonPath("$.metricas.rentabilidadeMedia").value(nullValue()))
                .andExpect(jsonPath("$.metricas.taxaOcupacao").value(nullValue()));
    }

    @Test
    void periodoSemViagensRespondeSemDados() throws Exception {
        consultarSetembro()
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SEM_DADOS"))
                .andExpect(jsonPath("$.metricas.totalViagens").value(0))
                .andExpect(jsonPath("$.metricas.freteTotal").value(nullValue()))
                .andExpect(jsonPath("$.series.porMes").isEmpty());
    }

    @Test
    void recusaDataForaDoFormato() throws Exception {
        mvc.perform(get("/dashboard")
                        .param("dataInicio", "2026-09-01")
                        .param("dataFim", "30/09/2026"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").exists());
    }

    @Test
    void recusaDataInicialPosteriorAFinal() throws Exception {
        mvc.perform(get("/dashboard")
                        .param("dataInicio", "30/09/2026")
                        .param("dataFim", "01/09/2026"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").exists());
    }

    @Test
    void recusaParametroAusente() throws Exception {
        mvc.perform(get("/dashboard").param("dataInicio", "01/09/2026"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value(
                        "Informe dataInicio e dataFim no formato dd/MM/aaaa."));
    }

    @Test
    void respondeIndisponivelQuandoOBancoFalha() throws Exception {
        when(repository.consultarResumo(any()))
                .thenThrow(new DataAccessResourceFailureException("banco fora"));

        consultarSetembro()
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.erro").exists());
    }
}
