package com.ominidevs.autenticacao.auth.controllers;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.ominidevs.autenticacao.auth.entities.Perfil;
import com.ominidevs.autenticacao.auth.entities.Usuario;
import com.ominidevs.autenticacao.auth.exceptions.AuthExceptionHandler;
import com.ominidevs.autenticacao.auth.repositories.UsuarioRepository;
import com.ominidevs.autenticacao.auth.services.AuthService;
import com.ominidevs.autenticacao.auth.services.TokenService;

import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.containsString;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AuthControllerTest {

    private static final String SEGREDO = "segredo-de-teste-com-mais-de-32-caracteres";
    private static final Instant AGORA = Instant.parse("2026-10-12T12:00:00Z");
    private static final String EMAIL = "gestor@newe.com.br";
    private static final String SENHA = "senha-correta";
    private static final String MENSAGEM_GENERICA = "E-mail ou senha inválidos.";

    private final UsuarioRepository repository = mock(UsuarioRepository.class);
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(4);
    private final TokenService tokenService = new TokenService(SEGREDO, 60, Clock.fixed(AGORA, ZoneOffset.UTC));
    private MockMvc mvc;

    @BeforeEach
    void configurar() {
        when(repository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(repository.findByEmail(EMAIL)).thenReturn(Optional.of(
                new Usuario("Gestor", EMAIL, passwordEncoder.encode(SENHA), Perfil.GESTOR)));

        mvc = MockMvcBuilders
                .standaloneSetup(new AuthController(new AuthService(repository, passwordEncoder, tokenService)))
                .setControllerAdvice(new AuthExceptionHandler())
                .build();
    }

    private ResultActions logar(String email, String senha) throws Exception {
        return mvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"" + email + "\",\"senha\":\"" + senha + "\"}"));
    }

    private ResultActions validar(String token) throws Exception {
        return mvc.perform(get("/auth/validar").header(HttpHeaders.AUTHORIZATION, "Bearer " + token));
    }

    @Test
    void loginValidoRetornaTokenDoUsuario() throws Exception {
        String resposta = logar(EMAIL, SENHA)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString())
                .andReturn().getResponse().getContentAsString();

        String token = resposta.substring(resposta.indexOf(":\"") + 2, resposta.lastIndexOf('"'));

        validar(token)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(EMAIL))
                .andExpect(jsonPath("$.nome").value("Gestor"))
                .andExpect(jsonPath("$.perfil").value("GESTOR"));
    }

    @Test
    void loginIgnoraMaiusculasEEspacosNoEmail() throws Exception {
        logar("  Gestor@Newe.com.br ", SENHA).andExpect(status().isOk());
    }

    @Test
    void senhaErradaRetorna401ComMensagemGenerica() throws Exception {
        logar(EMAIL, "senha-errada")
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.erro").value(MENSAGEM_GENERICA));
    }

    @Test
    void usuarioInexistenteRetorna401ComMensagemGenerica() throws Exception {
        logar("ninguem@newe.com.br", SENHA)
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.erro").value(MENSAGEM_GENERICA));
    }

    @Test
    void senhaErradaEUsuarioInexistenteTemRespostasIdenticas() throws Exception {
        String senhaErrada = logar(EMAIL, "senha-errada").andReturn().getResponse().getContentAsString();
        String inexistente = logar("ninguem@newe.com.br", SENHA).andReturn().getResponse().getContentAsString();

        assertEquals(senhaErrada, inexistente);
    }

    @Test
    void camposEmBrancoRetornam401() throws Exception {
        logar("", "").andExpect(status().isUnauthorized());
    }

    @Test
    void corpoAusenteRetorna400() throws Exception {
        mvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").exists());
    }

    @Test
    void respostaDeErroNaoExpoeASenha() throws Exception {
        logar(EMAIL, "senha-errada")
                .andExpect(content().string(not(containsString("senha-errada"))));
    }

    @Test
    void tokenExpiradoRetorna401() throws Exception {
        TokenService emissorAntigo = new TokenService(
                SEGREDO, 60, Clock.fixed(AGORA.minus(Duration.ofMinutes(61)), ZoneOffset.UTC));
        String tokenExpirado = emissorAntigo.gerar(new Usuario("Gestor", EMAIL, "hash", Perfil.GESTOR));

        validar(tokenExpirado)
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.erro").value("Token inválido ou expirado."));
    }

    @Test
    void validarSemTokenRetorna401() throws Exception {
        mvc.perform(get("/auth/validar")).andExpect(status().isUnauthorized());
    }

    @Test
    void respondeIndisponivelQuandoOBancoFalha() throws Exception {
        when(repository.findByEmail(EMAIL)).thenThrow(new DataAccessResourceFailureException("banco fora"));

        logar(EMAIL, SENHA)
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.erro").exists());
    }
}