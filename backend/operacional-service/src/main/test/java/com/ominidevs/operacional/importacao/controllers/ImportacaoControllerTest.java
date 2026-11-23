package com.ominidevs.operacional.importacao.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.ominidevs.operacional.importacao.dto.FiltroImportacao;
import com.ominidevs.operacional.importacao.entities.StatusImportacao;
import com.ominidevs.operacional.importacao.entities.TipoImportacao;
import com.ominidevs.operacional.importacao.services.ImportacaoHistoricoService;

/**
 * GET /importacoes. O contrato do parâmetro "tipo" é o nome do enum
 * ({@code VEICULO}/{@code MANIFESTO}, sem plural): a tela converte o tipo da
 * UI antes de montar a requisição (ver {@code TIPO_API} no front) e o valor
 * fora do contrato responde 400 em vez de cair em outro lugar.
 */
@WebMvcTest(ImportacaoController.class)
class ImportacaoControllerTest {

    @Autowired private MockMvc mvc;

    @MockitoBean private ImportacaoHistoricoService historico;

    @Test
    void aceitaOTipoNoFormatoDoEnumEnviadoPelaTela() throws Exception {
        when(historico.listar(any())).thenReturn(List.of());

        mvc.perform(get("/importacoes").param("tipo", "VEICULO"))
                .andExpect(status().isOk());

        var captor = ArgumentCaptor.forClass(FiltroImportacao.class);
        verify(historico).listar(captor.capture());
        assertEquals(TipoImportacao.VEICULO, captor.getValue().tipo());
        assertNull(captor.getValue().status());
    }

    @Test
    void caixaDoTipoELivre() throws Exception {
        when(historico.listar(any())).thenReturn(List.of());

        mvc.perform(get("/importacoes").param("tipo", "veiculo"))
                .andExpect(status().isOk());

        var captor = ArgumentCaptor.forClass(FiltroImportacao.class);
        verify(historico).listar(captor.capture());
        assertEquals(TipoImportacao.VEICULO, captor.getValue().tipo());
    }

    @Test
    void tipoNoPluralNaoEFazParteDoContrato() throws Exception {
        mvc.perform(get("/importacoes").param("tipo", "veiculos"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void converteTambemOsDemaisParametrosDaTela() throws Exception {
        when(historico.listar(any())).thenReturn(List.of());

        mvc.perform(get("/importacoes")
                        .param("tipo", "manifesto")
                        .param("status", "parcial")
                        .param("de", "2026-11-01")
                        .param("ate", "2026-11-17"))
                .andExpect(status().isOk());

        var captor = ArgumentCaptor.forClass(FiltroImportacao.class);
        verify(historico).listar(captor.capture());
        FiltroImportacao filtro = captor.getValue();
        assertEquals(TipoImportacao.MANIFESTO, filtro.tipo());
        assertEquals(StatusImportacao.PARCIAL, filtro.status());
        assertEquals(LocalDate.of(2026, 11, 1), filtro.de());
        assertEquals(LocalDate.of(2026, 11, 17), filtro.ate());
    }

    @Test
    void devolveListaVaziaQuandoNadaFoiImportado() throws Exception {
        when(historico.listar(any())).thenReturn(List.of());

        mvc.perform(get("/importacoes").param("tipo", "VEICULO"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void tipoDesconhecidoResponde400EmVezDe500() throws Exception {
        mvc.perform(get("/importacoes").param("tipo", "caminhao"))
                .andExpect(status().isBadRequest());
    }
}
