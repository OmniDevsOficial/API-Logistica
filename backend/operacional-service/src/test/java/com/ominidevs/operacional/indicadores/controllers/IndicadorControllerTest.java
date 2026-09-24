package com.ominidevs.operacional.indicadores.controllers;

import com.ominidevs.operacional.indicadores.dto.ViagensPorMotoristaDTO;
import com.ominidevs.operacional.indicadores.services.IndicadorService;
import com.ominidevs.operacional.viagem.entities.StatusViagem;
import com.ominidevs.operacional.viagem.entities.Viagem;
import com.ominidevs.operacional.viagem.exceptions.FiltroInvalidoException;

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

@WebMvcTest(IndicadorController.class)
class IndicadorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private IndicadorService indicadorService;

    @Test
    @DisplayName("GET /indicadores/viagens-por-motorista?periodo= deve retornar 200 com os totais")
    void deveListarTotaisPorMotorista() throws Exception {

        when(indicadorService.contarViagensPorMotorista("2026-09"))
                .thenReturn(List.of(
                        new ViagensPorMotoristaDTO("12233245124", "João da Silva", 18L),
                        new ViagensPorMotoristaDTO("98765432100", "Maria Souza", 7L)
                ));

        mockMvc.perform(get("/indicadores/viagens-por-motorista").param("periodo", "2026-09"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].cpfMotorista").value("12233245124"))
                .andExpect(jsonPath("$[0].motorista").value("João da Silva"))
                .andExpect(jsonPath("$[0].totalViagens").value(18));
    }

    @Test
    @DisplayName("Motorista com total 0 deve aparecer no JSON, não ser omitido")
    void deveIncluirMotoristaComTotalZero() throws Exception {

        when(indicadorService.contarViagensPorMotorista("2026-09"))
                .thenReturn(List.of(
                        new ViagensPorMotoristaDTO("55544433322", "Carlos Lima", 0L)
                ));

        mockMvc.perform(get("/indicadores/viagens-por-motorista").param("periodo", "2026-09"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].totalViagens").value(0));
    }

    @Test
    @DisplayName("Período inválido deve retornar 400 com corpo de erro")
    void deveRetornar400QuandoPeriodoInvalido() throws Exception {

        when(indicadorService.contarViagensPorMotorista(anyString()))
                .thenThrow(new FiltroInvalidoException("periodo deve estar no formato YYYY-MM"));

        mockMvc.perform(get("/indicadores/viagens-por-motorista").param("periodo", "setembro-2026"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("periodo deve estar no formato YYYY-MM"));
    }

    @Test
    @DisplayName("GET com CPF no caminho deve retornar 200 com as viagens do detalhamento")
    void deveDetalharViagensDoMotorista() throws Exception {

        Viagem viagem = new Viagem(
                "MAN-001",
                LocalDate.of(2026, 9, 10),
                "João da Silva",
                "12233245124",
                "ABC1D23",
                "São Paulo",
                new BigDecimal("1500.50"),
                null,
                null,
                StatusViagem.FINALIZADO,
                null
        );

        when(indicadorService.listarViagensDoMotorista("12233245124", "2026-09"))
                .thenReturn(List.of(viagem));

        mockMvc.perform(get("/indicadores/viagens-por-motorista/12233245124")
                        .param("periodo", "2026-09"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].manifesto").value("MAN-001"))
                .andExpect(jsonPath("$[0].cidadeDestino").value("São Paulo"));
    }
}
