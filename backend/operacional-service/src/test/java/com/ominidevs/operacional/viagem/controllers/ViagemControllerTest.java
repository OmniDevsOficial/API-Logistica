package com.ominidevs.operacional.viagem.controllers;

import com.ominidevs.operacional.viagem.entities.StatusViagem;
import com.ominidevs.operacional.viagem.entities.Viagem;
import com.ominidevs.operacional.viagem.exceptions.FiltroInvalidoException;
import com.ominidevs.operacional.viagem.services.ViagemService;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
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
 * Cobre filtros, lista vazia e validação de parâmetros.
 */
class ViagemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ViagemService viagemService;

    private Viagem criarViagem() {
        return new Viagem(
                "MAN-001",                                    // manifesto
                LocalDate.of(2026, 9, 10),                   // data
                "João da Silva",                              // motorista
                "12233245124",                                // cpf_motorista
                "ABC1D23",                                    // veiculo
                "São Paulo",                                  // cidadeOrigem ← ORIGEM
                "Rio de Janeiro",                             // cidadeDestino ← DESTINO
                new BigDecimal("1500.50"),                    // valorFrete
                1000,                                         // kmSaida
                1100,                                         // kmChegada
                StatusViagem.PENDENTE,                        // status
                "Observação teste",                           // observacoes
                2                                             // estimativaDias
        );
    }

    @Test
    @DisplayName("GET viagens sem filtro deve retornar 200 com todas")
    void deveListarTodasAsViagensQuandoSemFiltro() throws Exception {

        when(viagemService.filtrar(isNull(), isNull(), isNull(), isNull(), isNull()))
                .thenReturn(List.of(criarViagem()));

        mockMvc.perform(get("viagens"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(123))
                .andExpect(jsonPath("$[0].destino").value("Rio de Janeiro"));
    }

    @Test
    @DisplayName("GET viagens?destino= deve filtrar por destino")
    void deveListarViagensFiltradasPorDestino() throws Exception {

        Viagem viagem = criarViagem();
        when(viagemService.filtrar(
                eq("Rio de Janeiro"),
                isNull(),
                isNull(),
                isNull(),
                isNull()
        )).thenReturn(List.of(viagem));

        mockMvc.perform(get("viagens").param("destino", "Rio de Janeiro"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].destino").value("Rio de Janeiro"));
    }

    @Test
    @DisplayName("GET viagens?destino= sem resultado retorna 200 vazio")
    void deveRetornarListaVaziaSemErroQuandoNenhumaViagem() throws Exception {

        when(viagemService.filtrar(
                eq("Destino inexistente"),
                isNull(),
                isNull(),
                isNull(),
                isNull()
        )).thenReturn(List.of());

        mockMvc.perform(get("viagens").param("destino", "Destino inexistente"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    @DisplayName("GET viagens?status= deve filtrar por status único")
    void deveListarViagensFiltradasPorStatusUnico() throws Exception {

        Viagem viagem = criarViagem();
        when(viagemService.filtrar(
                isNull(),
                eq(List.of(StatusViagem.PENDENTE)),
                isNull(),
                isNull(),
                isNull()
        )).thenReturn(List.of(viagem));

        mockMvc.perform(get("viagens").param("status", "PENDENTE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].status").value("pendente"));
    }

    @Test
    @DisplayName("GET viagens?status=,status= deve aceitar múltiplos status")
    void deveAceitarMultiplosStatusCombinados() throws Exception {

        Viagem viagem = criarViagem();
        when(viagemService.filtrar(
                isNull(),
                eq(List.of(StatusViagem.PENDENTE, StatusViagem.EM_TRANSITO)),
                isNull(),
                isNull(),
                isNull()
        )).thenReturn(List.of(viagem));

        mockMvc.perform(get("viagens")
                .param("status", "PENDENTE")
                .param("status", "EM_TRANSITO"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    @DisplayName("GET viagens?freteMin=&freteMax= deve filtrar por frete")
    void deveListarViagensFiltradasPorFaixaDeFrete() throws Exception {

        Viagem viagem = criarViagem();
        when(viagemService.filtrar(
                isNull(),
                isNull(),
                eq(new BigDecimal("1000.00")),
                eq(new BigDecimal("2000.00")),
                isNull()
        )).thenReturn(List.of(viagem));

        mockMvc.perform(get("viagens")
                .param("freteMin", "1000.00")
                .param("freteMax", "2000.00"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    @DisplayName("GET viagens?mes= deve filtrar por mês (YYYY-MM)")
    void deveListarViagensFiltradasPorMes() throws Exception {

        Viagem viagem = criarViagem();
        when(viagemService.filtrar(
                isNull(),
                isNull(),
                isNull(),
                isNull(),
                eq("2026-09")
        )).thenReturn(List.of(viagem));

        mockMvc.perform(get("viagens").param("mes", "2026-09"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    @DisplayName("GET viagens?mes= inválido deve retornar 400 com erro")
    void deveRetornar400ParaMesInvalido() throws Exception {

        when(viagemService.filtrar(
                isNull(),
                isNull(),
                isNull(),
                isNull(),
                eq("setembro-2026")
        )).thenThrow(new FiltroInvalidoException("mes deve estar no formato YYYY-MM"));

        mockMvc.perform(get("viagens").param("mes", "setembro-2026"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("mes deve estar no formato YYYY-MM"));
    }

    @Test
    @DisplayName("GET viagens?freteMin> >freteMax deve retornar 400")
    void deveRetornar400ParaFaixaDeFreteInvalida() throws Exception {

        when(viagemService.filtrar(
                isNull(),
                isNull(),
                eq(new BigDecimal("2000.00")),
                eq(new BigDecimal("1000.00")),
                isNull()
        )).thenThrow(new FiltroInvalidoException("freteMin não pode ser maior que freteMax"));

        mockMvc.perform(get("viagens")
                .param("freteMin", "2000.00")
                .param("freteMax", "1000.00"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("freteMin não pode ser maior que freteMax"));
    }

    @Test
    @DisplayName("GET viagens deve retornar ViagemResponseDTO com campos corretos")
    void deveRetornarDTOComCamposCorretos() throws Exception {

        Viagem viagem = criarViagem();
        when(viagemService.filtrar(isNull(), isNull(), isNull(), isNull(), isNull()))
                .thenReturn(List.of(viagem));

        mockMvc.perform(get("viagens"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").exists())
                .andExpect(jsonPath("$[0].origem").value("São Paulo"))      // getCidadeOrigem()
                .andExpect(jsonPath("$[0].destino").value("Rio de Janeiro")) // getCidadeDestino()
                .andExpect(jsonPath("$[0].freteEstimado").value(1500.50))
                .andExpect(jsonPath("$[0].veiculo").value("ABC1D23"))
                .andExpect(jsonPath("$[0].distanciaKm").value(100))         // kmChegada - kmSaida = 1100 - 1000
                .andExpect(jsonPath("$[0].estimativaDias").value(2))
                .andExpect(jsonPath("$[0].status").value("pendente"));      // converterStatusParaFrontend
    }

    @Test
    @DisplayName("GET viagens com combinação de filtros")
    void deveAceitarCombinacaoDeMultiplosFiltros() throws Exception {

        Viagem viagem = criarViagem();
        when(viagemService.filtrar(
                eq("Rio de Janeiro"),
                eq(List.of(StatusViagem.PENDENTE)),
                eq(new BigDecimal("1000.00")),
                eq(new BigDecimal("2000.00")),
                eq("2026-09")
        )).thenReturn(List.of(viagem));

        mockMvc.perform(get("viagens")
                .param("destino", "Rio de Janeiro")
                .param("status", "PENDENTE")
                .param("freteMin", "1000.00")
                .param("freteMax", "2000.00")
                .param("mes", "2026-09"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }
}