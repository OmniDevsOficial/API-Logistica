package com.ominidevs.operacional.viagem.controllers;

import com.ominidevs.operacional.viagem.dto.RankingDestinoResponse;
import com.ominidevs.operacional.viagem.exceptions.FiltroInvalidoException;
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
        when(viagemService.rankingDestinosPorRentabilidade("2026-09")).thenReturn(List.of(
                new RankingDestinoResponse("Curitiba", 2, new BigDecimal("1250.75")),
                new RankingDestinoResponse("Campinas", 1, new BigDecimal("-30.00"))));

        mockMvc.perform(get("/viagens/ranking-destinos").param("mes", "2026-09"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].destino").value("Curitiba"))
                .andExpect(jsonPath("$[0].quantidadeViagens").value(2))
                .andExpect(jsonPath("$[0].rentabilidadeMedia").value(1250.75))
                .andExpect(jsonPath("$[1].destino").value("Campinas"))
                .andExpect(jsonPath("$[1].rentabilidadeMedia").value(-30.00));
    }

    @Test
    @DisplayName("Mês sem viagens retorna 200 com lista vazia")
    void mesSemViagensRetornaListaVazia() throws Exception {
        when(viagemService.rankingDestinosPorRentabilidade("2026-12")).thenReturn(List.of());

        mockMvc.perform(get("/viagens/ranking-destinos").param("mes", "2026-12"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    @DisplayName("Mês inválido retorna 400 com mensagem")
    void mesInvalidoRetorna400() throws Exception {
        when(viagemService.rankingDestinosPorRentabilidade("09/2026"))
                .thenThrow(new FiltroInvalidoException("mes deve estar no formato YYYY-MM"));

        mockMvc.perform(get("/viagens/ranking-destinos").param("mes", "09/2026"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("mes deve estar no formato YYYY-MM"));
    }

    @Test
    @DisplayName("Mês ausente retorna 400 com mensagem")
    void mesAusenteRetorna400() throws Exception {
        when(viagemService.rankingDestinosPorRentabilidade(isNull()))
                .thenThrow(new FiltroInvalidoException("mes é obrigatório no formato YYYY-MM"));

        mockMvc.perform(get("/viagens/ranking-destinos"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("mes é obrigatório no formato YYYY-MM"));
    }
}
