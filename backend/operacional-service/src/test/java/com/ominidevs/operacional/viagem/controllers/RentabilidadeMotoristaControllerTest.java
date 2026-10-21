package com.ominidevs.operacional.viagem.controllers;

import com.ominidevs.operacional.viagem.services.ViagemService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ViagemController.class)
class RentabilidadeMotoristaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ViagemService viagemService;

    @Test
    @DisplayName("Formato de data inválido retorna 400 com mensagem")
    void formatoDataInvalidoRetorna400() throws Exception {
        mockMvc.perform(get("/viagens/rentabilidade/motoristas")
                        .param("dataInicio", "2026-04-01")
                        .param("dataFim", "30/06/2026"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("Informe datas válidas no formato dd/MM/aaaa."));
    }

    @Test
    @DisplayName("Período invertido retorna 400 com mensagem")
    void periodoInvertidoRetorna400() throws Exception {
        mockMvc.perform(get("/viagens/rentabilidade/motoristas")
                        .param("dataInicio", "30/06/2026")
                        .param("dataFim", "01/04/2026"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro")
                        .value("A data inicial deve ser anterior ou igual à data final."));
    }
}
