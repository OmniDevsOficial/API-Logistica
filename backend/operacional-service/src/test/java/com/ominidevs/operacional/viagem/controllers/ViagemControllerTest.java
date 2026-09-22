package com.ominidevs.operacional.viagem.controllers;

import com.ominidevs.operacional.viagem.entities.StatusViagem;
import com.ominidevs.operacional.viagem.entities.Viagem;
import com.ominidevs.operacional.viagem.exceptions.FiltroInvalidoException;
import com.ominidevs.operacional.viagem.services.ViagemService;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Testes do endpoint GET /viagens (OM-76).
 * Cobre os critérios de aceite via a camada HTTP: filtro aplicado,
 * lista vazia sem erro e parâmetro inválido retornando 400.
 */
@WebMvcTest(ViagemController.class)
class ViagemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ViagemService viagemService;

    private Viagem criarViagem() {
        return new Viagem(
                "MAN-001",
                LocalDate.of(2026, 9, 10),
                "João da Silva",
                "12233245124",
                "ABC1D23",
                "São Paulo",
                new BigDecimal("1500.50"),
                null,
                null,
                StatusViagem.PENDENTE,
                null
        );
    }

    @Test
    @DisplayName("GET /viagens?destino= deve retornar 200 com a lista filtrada")
    void deveListarViagensFiltradasPorDestino() throws Exception {

        when(viagemService.filtrar(eq("São Paulo"), isNull(), isNull(), isNull(), isNull()))
                .thenReturn(List.of(criarViagem()));

        mockMvc.perform(get("/viagens").param("destino", "São Paulo"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].cidadeDestino").value("São Paulo"));
    }

    @Test
    @DisplayName("GET /viagens sem resultado deve retornar 200 com lista vazia, sem erro")
    void deveRetornarListaVaziaSemErro() throws Exception {

        when(viagemService.filtrar(eq("Destino inexistente"), isNull(), isNull(), isNull(), isNull()))
                .thenReturn(List.of());

        mockMvc.perform(get("/viagens").param("destino", "Destino inexistente"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    @DisplayName("GET /viagens?mes= inválido deve retornar 400 com corpo de erro")
    void deveRetornar400ParaMesInvalido() throws Exception {

        when(viagemService.filtrar(isNull(), isNull(), isNull(), isNull(), eq("setembro-2026")))
                .thenThrow(new FiltroInvalidoException("mes deve estar no formato YYYY-MM"));

        mockMvc.perform(get("/viagens").param("mes", "setembro-2026"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("mes deve estar no formato YYYY-MM"));
    }

    @Test
    @DisplayName("GET /viagens?status= deve aceitar múltiplos valores combinados")
    void deveAceitarMultiplosStatusCombinados() throws Exception {

        when(viagemService.filtrar(
                isNull(),
                eq(List.of(StatusViagem.PENDENTE, StatusViagem.FINALIZADO)),
                isNull(), isNull(), isNull()
        )).thenReturn(List.of());

        mockMvc.perform(get("/viagens").param("status", "PENDENTE,FINALIZADO"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("GET /viagens?freteMin=&freteMax= inválido deve retornar 400")
    void deveRetornar400ParaFaixaDeFreteInvalida() throws Exception {

        when(viagemService.filtrar(
                isNull(), isNull(), eq(new BigDecimal("2000.00")), eq(new BigDecimal("1000.00")), isNull()
        )).thenThrow(new FiltroInvalidoException("freteMin não pode ser maior que freteMax"));

        mockMvc.perform(get("/viagens")
                        .param("freteMin", "2000.00")
                        .param("freteMax", "1000.00"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("freteMin não pode ser maior que freteMax"));
    }
}
