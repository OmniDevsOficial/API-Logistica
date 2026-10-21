package com.ominidevs.relatorio.seguranca;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.ominidevs.relatorio.manifesto.ManifestoController;
import com.ominidevs.relatorio.manifesto.ManifestoService;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = ManifestoController.class)
@Import(SegurancaConfig.class)
@TestPropertySource(properties = {
        "jwt.secret=" + TokensDeTeste.SEGREDO,
        "cors.allowed-origins=http://localhost:5173,http://localhost:3000"
})
class SegurancaTest {

    private static final MockMultipartFile ARQUIVO =
            new MockMultipartFile("file", "manifesto.csv", "text/csv", "Manifesto;CPF".getBytes());

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private ManifestoService manifestoService;

    @MockitoBean
    private CacheManager cacheManager;

    private static String bearer(String token) {
        return "Bearer " + token;
    }

    @Test
    void semTokenRetorna401() throws Exception {
        mvc.perform(multipart("/manifestos/upload").file(ARQUIVO))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.erro").value("Token ausente, inválido ou expirado."));
    }

    @Test
    void tokenExpiradoRetorna401() throws Exception {
        mvc.perform(multipart("/manifestos/upload").file(ARQUIVO)
                        .header(HttpHeaders.AUTHORIZATION, bearer(TokensDeTeste.expirado("OPERADOR"))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void tokenAssinadoComOutraChaveRetorna401() throws Exception {
        mvc.perform(multipart("/manifestos/upload").file(ARQUIVO)
                        .header(HttpHeaders.AUTHORIZATION, bearer(TokensDeTeste.comOutraChave("OPERADOR"))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void operadorEGestorEnviamManifesto() throws Exception {
        when(manifestoService.processarManifesto(any())).thenReturn(List.of(Map.of("Manifesto", "123")));

        for (String perfil : List.of("OPERADOR", "GESTOR")) {
            mvc.perform(multipart("/manifestos/upload").file(ARQUIVO)
                            .header(HttpHeaders.AUTHORIZATION, bearer(TokensDeTeste.valido(perfil))))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$[0].Manifesto").value("123"));
        }
    }

    @Test
    void tokenSemPerfilRetorna403() throws Exception {
        mvc.perform(multipart("/manifestos/upload").file(ARQUIVO)
                        .header(HttpHeaders.AUTHORIZATION, bearer(TokensDeTeste.valido(null))))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.erro").value("Seu perfil não tem permissão para acessar este recurso."));
    }

    @Test
    void preflightDeOrigemPermitidaPassaSemToken() throws Exception {
        mvc.perform(options("/manifestos/upload")
                        .header(HttpHeaders.ORIGIN, "http://localhost:3000")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS, "authorization"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:3000"));
    }
}