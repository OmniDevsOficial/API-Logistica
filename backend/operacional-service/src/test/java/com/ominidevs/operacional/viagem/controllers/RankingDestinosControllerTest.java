package com.ominidevs.operacional.viagem.controllers;

import com.ominidevs.operacional.indicadores.exceptions.IndicadorInvalidoException;
import com.ominidevs.operacional.viagem.dto.RankingDestinoResponse;
import com.ominidevs.operacional.viagem.services.ViagemService;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Contrato HTTP de GET /viagens/ranking-destinos.
 */
@WebMvcTest(ViagemController.class)
class RankingDestinosControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ViagemService viagemService;

    @Test
    @DisplayName("Retorna 200 com o ranking na ordem do serviço")
    void retornaRanking() throws Exception {
        when(viagemService.rankingDestinosPorRentabilidade("01/01/2026", "31/12/2026")).thenReturn(List.of(
                new RankingDestinoResponse("Matriz", "Curitiba", 2, new BigDecimal("1250.75")),
                new RankingDestinoResponse("Matriz", "Campinas", 1, new BigDecimal("-30.00"))));

        mockMvc.perform(get("/viagens/ranking-destinos")
                        .param("dataInicio", "01/01/2026")
                        .param("dataFim", "31/12/2026"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].origem").value("Matriz"))
                .andExpect(jsonPath("$[0].destino").value("Curitiba"))
                .andExpect(jsonPath("$[0].quantidadeViagens").value(2))
                .andExpect(jsonPath("$[0].rentabilidadeMedia").value(1250.75))
                .andExpect(jsonPath("$[1].destino").value("Campinas"))
                .andExpect(jsonPath("$[1].rentabilidadeMedia").value(-30.00));
    }

    @Test
    @DisplayName("Período sem viagens retorna 200 com lista vazia")
    void periodoSemViagensRetornaListaVazia() throws Exception {
        when(viagemService.rankingDestinosPorRentabilidade("01/12/2026", "31/12/2026")).thenReturn(List.of());

        mockMvc.perform(get("/viagens/ranking-destinos")
                        .param("dataInicio", "01/12/2026")
                        .param("dataFim", "31/12/2026"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    @DisplayName("Data inválida retorna 400 com mensagem")
    void dataInvalidaRetorna400() throws Exception {
        when(viagemService.rankingDestinosPorRentabilidade("2026-01-01", "31/12/2026"))
                .thenThrow(new IndicadorInvalidoException("Informe datas válidas no formato dd/MM/aaaa."));

        mockMvc.perform(get("/viagens/ranking-destinos")
                        .param("dataInicio", "2026-01-01")
                        .param("dataFim", "31/12/2026"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("Informe datas válidas no formato dd/MM/aaaa."));
    }

    @Test
    @DisplayName("Datas ausentes retornam 400 com mensagem")
    void datasAusentesRetornam400() throws Exception {
        when(viagemService.rankingDestinosPorRentabilidade(isNull(), isNull()))
                .thenThrow(new IndicadorInvalidoException("Informe datas válidas no formato dd/MM/aaaa."));

        mockMvc.perform(get("/viagens/ranking-destinos"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("Informe datas válidas no formato dd/MM/aaaa."));
    }
}
