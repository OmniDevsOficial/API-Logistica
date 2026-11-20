package com.ominidevs.autenticacao.perfil.controllers;

import java.time.Clock;
import java.time.Instant;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import com.ominidevs.autenticacao.auth.entities.Perfil;
import com.ominidevs.autenticacao.auth.entities.Usuario;
import com.ominidevs.autenticacao.auth.services.TokenService;
import com.ominidevs.autenticacao.perfil.dto.AlterarFotoRequest;
import com.ominidevs.autenticacao.perfil.dto.AlterarNomeRequest;
import com.ominidevs.autenticacao.perfil.dto.PerfilAtualizadoResponse;
import com.ominidevs.autenticacao.perfil.dto.PerfilResponse;
import com.ominidevs.autenticacao.perfil.exceptions.PerfilNaoEncontradoException;
import com.ominidevs.autenticacao.perfil.services.PerfilService;
import com.ominidevs.autenticacao.seguranca.SegurancaConfig;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.not;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = PerfilController.class)
@Import(SegurancaConfig.class)
@TestPropertySource(properties = {
        "jwt.secret=" + PerfilControllerTest.SEGREDO,
        "cors.allowed-origins=http://localhost:5173"
})
class PerfilControllerTest {

    static final String SEGREDO = "segredo-apenas-para-testes-com-mais-de-32-caracteres";
    private static final Instant CRIADO_EM = Instant.parse("2026-11-17T12:00:00Z");
    private static final String EMAIL = "ana@newe.com.br";
    private static final String FOTO = "data:image/png;base64,iVBORw0KGgo=";

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private PerfilService service;

    private static String operador() {
        TokenService tokens = new TokenService(SEGREDO, 60, Clock.systemUTC());
        return "Bearer " + tokens.gerar(new Usuario("Ana Souza", EMAIL, "hash", Perfil.OPERADOR));
    }

    private static PerfilResponse ana(String nome, String foto) {
        return new PerfilResponse(3, nome, EMAIL, Perfil.OPERADOR, true, CRIADO_EM, foto);
    }

    private ResultActions enviar(String rota, String corpo) throws Exception {
        return mvc.perform(patch(rota)
                .header(HttpHeaders.AUTHORIZATION, operador())
                .contentType(MediaType.APPLICATION_JSON)
                .content(corpo));
    }

    @Test
    void semTokenRetorna401() throws Exception {
        mvc.perform(get("/perfil")).andExpect(status().isUnauthorized());
        mvc.perform(patch("/perfil").contentType(MediaType.APPLICATION_JSON).content("{\"nome\":\"Ana\"}"))
                .andExpect(status().isUnauthorized());
        mvc.perform(patch("/perfil/foto").contentType(MediaType.APPLICATION_JSON).content("{\"foto\":null}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void qualquerPerfilVeOProprioPerfilSemSenha() throws Exception {
        when(service.buscar(EMAIL)).thenReturn(ana("Ana Souza", null));

        mvc.perform(get("/perfil").header(HttpHeaders.AUTHORIZATION, operador()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Ana Souza"))
                .andExpect(jsonPath("$.email").value(EMAIL))
                .andExpect(jsonPath("$.perfil").value("OPERADOR"))
                .andExpect(jsonPath("$.criadoEm").value("2026-11-17T12:00:00Z"))
                .andExpect(content().string(not(containsString("senha"))));
    }

    @Test
    void alteraONomeDoUsuarioDoToken() throws Exception {
        when(service.alterarNome(eq(EMAIL), any()))
                .thenReturn(new PerfilAtualizadoResponse(ana("Ana Lima", null), "token-novo"));

        enviar("/perfil", "{\"nome\":\"Ana Lima\"}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.perfil.nome").value("Ana Lima"))
                .andExpect(jsonPath("$.token").value("token-novo"));

        ArgumentCaptor<AlterarNomeRequest> captor = ArgumentCaptor.forClass(AlterarNomeRequest.class);
        verify(service).alterarNome(eq(EMAIL), captor.capture());
        assertEquals("Ana Lima", captor.getValue().nome());
    }

    @Test
    void nomeVazioOuLongoDemaisRetorna400() throws Exception {
        enviar("/perfil", "{\"nome\":\"   \"}")
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.campos.nome").value("Informe o nome."));
        enviar("/perfil", "{\"nome\":\"" + "a".repeat(121) + "\"}")
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.campos.nome").value("O nome pode ter no máximo 120 caracteres."));

        verify(service, never()).alterarNome(anyString(), any());
    }

    @Test
    void salvaAFotoEmBase64() throws Exception {
        when(service.alterarFoto(eq(EMAIL), any())).thenReturn(ana("Ana Souza", FOTO));

        enviar("/perfil/foto", "{\"foto\":\"" + FOTO + "\"}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.foto").value(FOTO));
    }

    @Test
    void fotoNulaRemoveAFoto() throws Exception {
        when(service.alterarFoto(eq(EMAIL), any())).thenReturn(ana("Ana Souza", null));

        enviar("/perfil/foto", "{\"foto\":null}").andExpect(status().isOk());

        ArgumentCaptor<AlterarFotoRequest> captor = ArgumentCaptor.forClass(AlterarFotoRequest.class);
        verify(service).alterarFoto(eq(EMAIL), captor.capture());
        assertNull(captor.getValue().foto());
    }

    @Test
    void recusaArquivoQueNaoEImagem() throws Exception {
        enviar("/perfil/foto", "{\"foto\":\"data:text/html;base64,PHNjcmlwdD4=\"}")
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.campos.foto").value("Envie uma imagem PNG, JPG ou WEBP."));

        verify(service, never()).alterarFoto(anyString(), any());
    }

    @Test
    void recusaFotoGrandeDemais() throws Exception {
        String grande = "data:image/jpeg;base64," + "A".repeat(AlterarFotoRequest.TAMANHO_MAXIMO);

        enviar("/perfil/foto", "{\"foto\":\"" + grande + "\"}")
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.campos.foto").exists());

        verify(service, never()).alterarFoto(anyString(), any());
    }

    @Test
    void usuarioApagadoRecebe404() throws Exception {
        when(service.buscar(EMAIL)).thenThrow(new PerfilNaoEncontradoException());

        mvc.perform(get("/perfil").header(HttpHeaders.AUTHORIZATION, operador()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.erro").value("Seu usuário não foi encontrado. Entre novamente."));
    }
}
