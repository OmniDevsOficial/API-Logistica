package com.ominidevs.autenticacao.usuarios.controllers;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;

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

import com.ominidevs.autenticacao.auth.controllers.AuthController;
import com.ominidevs.autenticacao.auth.dto.LoginResponse;
import com.ominidevs.autenticacao.auth.entities.Perfil;
import com.ominidevs.autenticacao.auth.entities.Usuario;
import com.ominidevs.autenticacao.auth.services.AuthService;
import com.ominidevs.autenticacao.auth.services.TokenService;
import com.ominidevs.autenticacao.seguranca.SegurancaConfig;
import com.ominidevs.autenticacao.usuarios.dto.AlterarStatusRequest;
import com.ominidevs.autenticacao.usuarios.dto.CriarUsuarioRequest;
import com.ominidevs.autenticacao.usuarios.dto.UsuarioResponse;
import com.ominidevs.autenticacao.usuarios.exceptions.AutoDesativacaoException;
import com.ominidevs.autenticacao.usuarios.exceptions.EmailEmUsoException;
import com.ominidevs.autenticacao.usuarios.exceptions.UsuarioNaoEncontradoException;
import com.ominidevs.autenticacao.usuarios.services.UsuarioService;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.not;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {UsuarioController.class, AuthController.class})
@Import(SegurancaConfig.class)
@TestPropertySource(properties = {
        "jwt.secret=" + UsuarioControllerTest.SEGREDO,
        "cors.allowed-origins=http://localhost:5173"
})
class UsuarioControllerTest {

    static final String SEGREDO = "segredo-apenas-para-testes-com-mais-de-32-caracteres";
    private static final Instant CRIADO_EM = Instant.parse("2026-11-17T12:00:00Z");
    private static final String FOTO = "data:image/jpeg;base64,/9j/4AAQ";
    private static final String CORPO_VALIDO = """
            {"nome":"Ana Souza","email":"ana@newe.com.br","perfil":"OPERADOR","senha":"senha-forte-123"}
            """;

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private UsuarioService usuarioService;

    @MockitoBean
    private AuthService authService;

    private static String token(Perfil perfil, Clock relogio) {
        TokenService tokens = new TokenService(SEGREDO, 60, relogio);
        return "Bearer " + tokens.gerar(new Usuario("Teste", "teste@newe.com.br", "hash", perfil));
    }

    private static String gestor() {
        return token(Perfil.GESTOR, Clock.systemUTC());
    }

    private static String operador() {
        return token(Perfil.OPERADOR, Clock.systemUTC());
    }

    private ResultActions cadastrar(String autorizacao, String corpo) throws Exception {
        return mvc.perform(post("/usuarios")
                .header(HttpHeaders.AUTHORIZATION, autorizacao)
                .contentType(MediaType.APPLICATION_JSON)
                .content(corpo));
    }

    private ResultActions alterarStatus(String autorizacao, int id, String corpo) throws Exception {
        return mvc.perform(patch("/usuarios/{id}/status", id)
                .header(HttpHeaders.AUTHORIZATION, autorizacao)
                .contentType(MediaType.APPLICATION_JSON)
                .content(corpo));
    }

    private static UsuarioResponse ana() {
        return new UsuarioResponse(3, "Ana Souza", "ana@newe.com.br", Perfil.OPERADOR, true, CRIADO_EM, FOTO);
    }

    @Test
    void semTokenRetorna401NosDoisEndpoints() throws Exception {
        mvc.perform(get("/usuarios"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.erro").value("Token ausente, inválido ou expirado."));
        mvc.perform(post("/usuarios").contentType(MediaType.APPLICATION_JSON).content(CORPO_VALIDO))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void tokenExpiradoRetorna401() throws Exception {
        String expirado = token(Perfil.GESTOR, Clock.fixed(Instant.parse("2020-01-01T00:00:00Z"), ZoneOffset.UTC));

        mvc.perform(get("/usuarios").header(HttpHeaders.AUTHORIZATION, expirado))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void operadorRecebe403NosDoisEndpoints() throws Exception {
        mvc.perform(get("/usuarios").header(HttpHeaders.AUTHORIZATION, operador()))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.erro").value("Seu perfil não tem permissão para acessar este recurso."));
        cadastrar(operador(), CORPO_VALIDO).andExpect(status().isForbidden());

        verify(usuarioService, never()).listar();
        verify(usuarioService, never()).criar(any());
    }

    @Test
    void gestorCadastraERecebe201SemSenhaNaResposta() throws Exception {
        when(usuarioService.criar(any())).thenReturn(ana());

        cadastrar(gestor(), CORPO_VALIDO)
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(3))
                .andExpect(jsonPath("$.nome").value("Ana Souza"))
                .andExpect(jsonPath("$.email").value("ana@newe.com.br"))
                .andExpect(jsonPath("$.perfil").value("OPERADOR"))
                .andExpect(jsonPath("$.ativo").value(true))
                .andExpect(jsonPath("$.criadoEm").value("2026-11-17T12:00:00Z"))
                .andExpect(content().string(not(containsString("senha"))));
    }

    @Test
    void emailChegaAoServicoJaNormalizado() throws Exception {
        when(usuarioService.criar(any())).thenReturn(ana());

        cadastrar(gestor(), """
                {"nome":"  Ana Souza ","email":"  Ana@Newe.COM.br ","perfil":"OPERADOR","senha":"senha-forte-123"}
                """).andExpect(status().isCreated());

        ArgumentCaptor<CriarUsuarioRequest> captor = ArgumentCaptor.forClass(CriarUsuarioRequest.class);
        verify(usuarioService).criar(captor.capture());
        assertEquals("ana@newe.com.br", captor.getValue().email());
        assertEquals("Ana Souza", captor.getValue().nome());
    }

    @Test
    void camposInvalidosRetornam400ComAListaDosCampos() throws Exception {
        cadastrar(gestor(), """
                {"nome":"%s","email":"ana@newe","perfil":"ADMIN","senha":"1234567"}
                """.formatted("a".repeat(121)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("Campos inválidos."))
                .andExpect(jsonPath("$.campos.nome").value("O nome pode ter no máximo 120 caracteres."))
                .andExpect(jsonPath("$.campos.email").value("Informe um e-mail válido."))
                .andExpect(jsonPath("$.campos.perfil").value("O perfil deve ser GESTOR ou OPERADOR."))
                .andExpect(jsonPath("$.campos.senha").value("A senha precisa ter entre 8 e 72 caracteres."));

        verify(usuarioService, never()).criar(any());
    }

    @Test
    void camposVaziosMostramAMensagemDeObrigatorio() throws Exception {
        cadastrar(gestor(), """
                {"nome":"   ","email":"","perfil":"","senha":""}
                """)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.campos.nome").value("Informe o nome."))
                .andExpect(jsonPath("$.campos.email").value("Informe o e-mail."))
                .andExpect(jsonPath("$.campos.perfil").value("Selecione o perfil."))
                .andExpect(jsonPath("$.campos.senha").value("Informe a senha."));
    }

    @Test
    void corpoMalFormadoRetorna400() throws Exception {
        cadastrar(gestor(), "{nao é json")
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("Corpo da requisição inválido."));
    }

    @Test
    void emailEmUsoRetorna409ComMensagemClara() throws Exception {
        when(usuarioService.criar(any())).thenThrow(new EmailEmUsoException());

        cadastrar(gestor(), CORPO_VALIDO)
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.erro").value("Esse e-mail já está em uso."));
    }

    @Test
    void gestorListaUsuariosSemSenha() throws Exception {
        when(usuarioService.listar()).thenReturn(List.of(ana()));

        mvc.perform(get("/usuarios").header(HttpHeaders.AUTHORIZATION, gestor()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].email").value("ana@newe.com.br"))
                .andExpect(jsonPath("$[0].ativo").value(true))
                .andExpect(jsonPath("$[0].foto").value(FOTO))
                .andExpect(content().string(not(containsString("senha"))));
    }

    @Test
    void loginContinuaPublicoMesmoComTokenInvalidoNoCabecalho() throws Exception {
        when(authService.login(any())).thenReturn(new LoginResponse("token"));

        mvc.perform(post("/auth/login")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer token-invalido")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"gestor@newe.com.br\",\"senha\":\"x\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("token"));
    }

    @Test
    void gestorDesativaUsuarioERecebeOStatusNovo() throws Exception {
        UsuarioResponse desativada = new UsuarioResponse(
                3, "Ana Souza", "ana@newe.com.br", Perfil.OPERADOR, false, CRIADO_EM, null);
        when(usuarioService.alterarStatus(eq(3), any(), anyString())).thenReturn(desativada);

        alterarStatus(gestor(), 3, "{\"ativo\":false}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(3))
                .andExpect(jsonPath("$.ativo").value(false));

        ArgumentCaptor<AlterarStatusRequest> captor = ArgumentCaptor.forClass(AlterarStatusRequest.class);
        verify(usuarioService).alterarStatus(eq(3), captor.capture(), eq("teste@newe.com.br"));
        assertEquals(false, captor.getValue().ativo());
    }

    @Test
    void operadorESemTokenNaoAlteramStatus() throws Exception {
        alterarStatus(operador(), 3, "{\"ativo\":false}").andExpect(status().isForbidden());
        mvc.perform(patch("/usuarios/3/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"ativo\":false}"))
                .andExpect(status().isUnauthorized());

        verify(usuarioService, never()).alterarStatus(anyInt(), any(), anyString());
    }

    @Test
    void statusAusenteRetorna400() throws Exception {
        alterarStatus(gestor(), 3, "{}")
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.campos.ativo").value("Informe o status."));

        verify(usuarioService, never()).alterarStatus(anyInt(), any(), anyString());
    }

    @Test
    void usuarioInexistenteRetorna404() throws Exception {
        when(usuarioService.alterarStatus(eq(99), any(), anyString())).thenThrow(new UsuarioNaoEncontradoException());

        alterarStatus(gestor(), 99, "{\"ativo\":false}")
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.erro").value("Usuário não encontrado."));
    }

    @Test
    void desativarOProprioUsuarioRetorna409() throws Exception {
        when(usuarioService.alterarStatus(eq(1), any(), anyString())).thenThrow(new AutoDesativacaoException());

        alterarStatus(gestor(), 1, "{\"ativo\":false}")
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.erro").value("Você não pode desativar o seu próprio usuário."));
    }
}
