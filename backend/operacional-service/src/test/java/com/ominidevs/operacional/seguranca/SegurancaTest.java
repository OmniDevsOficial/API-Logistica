package com.ominidevs.operacional.seguranca;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import com.ominidevs.operacional.dashboard.controllers.DashboardController;
import com.ominidevs.operacional.dashboard.services.DashboardService;
import com.ominidevs.operacional.motorista.controllers.MotoristaController;
import com.ominidevs.operacional.motorista.services.HistoricoViagemService;
import com.ominidevs.operacional.motorista.services.MotoristaService;
import com.ominidevs.operacional.motorista.services.RankingMotoristaService;
import com.ominidevs.operacional.viagem.controllers.ViagemController;
import com.ominidevs.operacional.viagem.services.ViagemService;
import com.ominidevs.operacional.indicadores.services.UtilizacaoService;
import com.ominidevs.operacional.veiculo.controllers.VeiculoController;
import com.ominidevs.operacional.veiculo.services.ImportacaoVeiculoService;
import com.ominidevs.operacional.veiculo.services.VeiculoConsultaService;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {
        DashboardController.class, ViagemController.class, MotoristaController.class, VeiculoController.class})
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

    @MockitoBean
    private MotoristaService motoristaService;

    @MockitoBean
    private RankingMotoristaService rankingMotoristaService;

    @MockitoBean
    private HistoricoViagemService historicoViagemService;

    @MockitoBean
    private UtilizacaoService utilizacaoService;

    @MockitoBean
    private ImportacaoVeiculoService importacaoVeiculoService;

    @MockitoBean
    private VeiculoConsultaService veiculoConsultaService;

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
    void operadorConsultaOsMotoristas() throws Exception {
        String token = bearer(TokensDeTeste.valido("OPERADOR"));

        mvc.perform(get("/motoristas").header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isOk());
        mvc.perform(get("/motoristas/resumo").header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isOk());
    }

    @Test
    void operadorEGestorConsultamOHistoricoDeViagens() throws Exception {
        mvc.perform(get("/motoristas/1/viagens")
                        .header(HttpHeaders.AUTHORIZATION, bearer(TokensDeTeste.valido("OPERADOR"))))
                .andExpect(status().isOk());
        mvc.perform(get("/motoristas/1/viagens")
                        .header(HttpHeaders.AUTHORIZATION, bearer(TokensDeTeste.valido("GESTOR"))))
                .andExpect(status().isOk());
    }

    @Test
    void historicoDeViagensSemTokenRetorna401() throws Exception {
        mvc.perform(get("/motoristas/1/viagens"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void operadorNaoAlteraStatusDoMotorista() throws Exception {
        mvc.perform(patch("/motoristas/1/status")
                        .header(HttpHeaders.AUTHORIZATION, bearer(TokensDeTeste.valido("OPERADOR")))
                        .contentType("application/json")
                        .content("{\"status\":\"ATIVO\"}"))
                .andExpect(status().isForbidden());
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

    @Test
    void gestorConsultaBaixaUtilizacao() throws Exception {
        mvc.perform(get("/motoristas/baixa-utilizacao")
                        .header(HttpHeaders.AUTHORIZATION, bearer(TokensDeTeste.valido("GESTOR"))))
                .andExpect(status().isOk());
    }

    @Test
    void operadorNaoConsultaBaixaUtilizacao() throws Exception {
        mvc.perform(get("/motoristas/baixa-utilizacao")
                        .header(HttpHeaders.AUTHORIZATION, bearer(TokensDeTeste.valido("OPERADOR"))))
                .andExpect(status().isForbidden());
    }

    @Test
    void gestorConsultaARentabilidadePorTipo() throws Exception {
        mvc.perform(get("/dashboard/rentabilidade-por-tipo").param("mes", "2026-01")
                        .header(HttpHeaders.AUTHORIZATION, bearer(TokensDeTeste.valido("GESTOR"))))
                .andExpect(status().isOk());
    }

    @Test
    void operadorNaoConsultaARentabilidadePorTipo() throws Exception {
        mvc.perform(get("/dashboard/rentabilidade-por-tipo").param("mes", "2026-01")
                        .header(HttpHeaders.AUTHORIZATION, bearer(TokensDeTeste.valido("OPERADOR"))))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.erro").value("Seu perfil não tem permissão para acessar este recurso."));
    }

    @Test
    void gestorConsultaORanking() throws Exception {
        mvc.perform(get("/motoristas/ranking").param("mes", "2026-09")
                        .header(HttpHeaders.AUTHORIZATION, bearer(TokensDeTeste.valido("GESTOR"))))
                .andExpect(status().isOk());
    }

    @Test
    void operadorNaoConsultaORanking() throws Exception {
        mvc.perform(get("/motoristas/ranking").param("mes", "2026-09")
                        .header(HttpHeaders.AUTHORIZATION, bearer(TokensDeTeste.valido("OPERADOR"))))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.erro").value("Seu perfil não tem permissão para acessar este recurso."));
    }

    @Test
    void semTokenNaoConsultaORanking() throws Exception {
        mvc.perform(get("/motoristas/ranking"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void gestorImportaVeiculos() throws Exception {
        mvc.perform(multipart("/veiculos/importacao").file(csvVeiculos())
                        .header(HttpHeaders.AUTHORIZATION, bearer(TokensDeTeste.valido("GESTOR"))))
                .andExpect(status().isOk());
    }

    @Test
    void operadorImportaVeiculos() throws Exception {
        mvc.perform(multipart("/veiculos/importacao").file(csvVeiculos())
                        .header(HttpHeaders.AUTHORIZATION, bearer(TokensDeTeste.valido("OPERADOR"))))
                .andExpect(status().isOk());
    }

    @Test
    void semTokenNaoImportaVeiculos() throws Exception {
        mvc.perform(multipart("/veiculos/importacao").file(csvVeiculos()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void operadorConsultaVeiculos() throws Exception {
        for (String rota : new String[] {"/veiculos", "/veiculos/tipos", "/veiculos/ABC1D23"}) {
            mvc.perform(get(rota).header(HttpHeaders.AUTHORIZATION, bearer(TokensDeTeste.valido("OPERADOR"))))
                    .andExpect(status().isOk());
        }
    }

    @Test
    void semTokenNaoConsultaVeiculos() throws Exception {
        mvc.perform(get("/veiculos")).andExpect(status().isUnauthorized());
    }

    private static MockMultipartFile csvVeiculos() {
        return new MockMultipartFile("file", "veiculos.csv", "text/csv", "Placa;Tipo Veículo".getBytes());
    }
}
