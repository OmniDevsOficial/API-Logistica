package com.ominidevs.operacional.motorista.controllers;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/** Testa a funcionalidade atualmente implementada no controller de motoristas. */
@WebMvcTest(MotoristaController.class)
class MotoristaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("GET /motoristas/ping retorna 200 e informa que o serviço está ativo")
    void deveRetornarStatusDoServico() throws Exception {
        mockMvc.perform(get("/motoristas/ping"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.TEXT_PLAIN))
                .andExpect(content().string("operacional-service ativo"));
    }
}
