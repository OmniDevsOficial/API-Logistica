package com.ominidevs.operacional.seguranca;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import com.ominidevs.operacional.dashboard.controllers.DashboardController;
import com.ominidevs.operacional.dashboard.services.DashboardService;
import com.ominidevs.operacional.viagem.controllers.ViagemController;
import com.ominidevs.operacional.viagem.services.ViagemService;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {DashboardController.class, ViagemController.class})
@Import(SegurancaConfig.class)
@TestPropertySource(properties = {
        "jwt.secret=" + TokensDeTeste.SEGREDO,
        "cors.allowed-origins=http://localhost:5173,http://localhost:3000"
})
class SegurancaTest {

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private DashboardService dashboardService;

    @MockitoBean
    private ViagemService viagemService;

    private MockHttpServletRequestBuilder dashboard() {
        return get("/dashboard").param("dataInicio", "01/09/2026").param("dataFim", "30/09/2026");
    }

    private static String bearer(String token) {
        return "Bearer " + token;
    }

    @Test
    void semTokenRetorna401() throws Exception {
        mvc.perform(get("/viagens"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.erro").value("Token ausente, inválido ou expirado."));
    }

    @Test
    void tokenExpiradoRetorna401() throws Exception {
        mvc.perform(get("/viagens").header(HttpHeaders.AUTHORIZATION, bearer(TokensDeTeste.expirado("GESTOR"))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.erro").exists());
    }

    @Test
    void tokenAssinadoComOutraChaveRetorna401() throws Exception {
        mvc.perform(get("/viagens")
                        .header(HttpHeaders.AUTHORIZATION, bearer(TokensDeTeste.comOutraChave("GESTOR"))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void tokenMalformadoRetorna401() throws Exception {
        mvc.perform(get("/viagens").header(HttpHeaders.AUTHORIZATION, bearer("nao-e-um-token")))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void gestorAcessaODashboard() throws Exception {
        mvc.perform(dashboard().header(HttpHeaders.AUTHORIZATION, bearer(TokensDeTeste.valido("GESTOR"))))
                .andExpect(status().isOk());
    }

    @Test
    void operadorNaoAcessaODashboard() throws Exception {
        mvc.perform(dashboard().header(HttpHeaders.AUTHORIZATION, bearer(TokensDeTeste.valido("OPERADOR"))))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.erro").value("Seu perfil não tem permissão para acessar este recurso."));
    }

    @Test
    void operadorAcessaAsViagens() throws Exception {
        mvc.perform(get("/viagens").header(HttpHeaders.AUTHORIZATION, bearer(TokensDeTeste.valido("OPERADOR"))))
                .andExpect(status().isOk());
    }

    @Test
    void gestorAcessaAsViagens() throws Exception {
        mvc.perform(get("/viagens").header(HttpHeaders.AUTHORIZATION, bearer(TokensDeTeste.valido("GESTOR"))))
                .andExpect(status().isOk());
    }

    @Test
    void tokenSemPerfilRetorna403() throws Exception {
        mvc.perform(get("/viagens").header(HttpHeaders.AUTHORIZATION, bearer(TokensDeTeste.valido(null))))
                .andExpect(status().isForbidden());
    }

    @Test
    void preflightDeOrigemPermitidaPassaSemToken() throws Exception {
        mvc.perform(options("/viagens")
                        .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "GET")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS, "authorization"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:5173"));
    }

    @Test
    void preflightDeOrigemDesconhecidaERecusado() throws Exception {
        mvc.perform(options("/viagens")
                        .header(HttpHeaders.ORIGIN, "http://site-desconhecido.com")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "GET"))
                .andExpect(status().isForbidden());
    }
}