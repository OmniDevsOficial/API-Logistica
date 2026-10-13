package com.ominidevs.relatorio.seguranca;

import java.time.Instant;
import java.util.Map;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.mock.http.client.MockClientHttpRequest;
import org.springframework.mock.http.client.MockClientHttpResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class RepasseTokenInterceptorTest {

    private final RepasseTokenInterceptor interceptor = new RepasseTokenInterceptor();
    private final MockClientHttpRequest requisicao = new MockClientHttpRequest(HttpMethod.GET, "/destino");

    @AfterEach
    void limparContexto() {
        SecurityContextHolder.clearContext();
    }

    private void executar() throws Exception {
        interceptor.intercept(requisicao, new byte[0],
                (request, body) -> new MockClientHttpResponse(new byte[0], 200));
    }

    @Test
    void repassaOTokenDoUsuarioAutenticado() throws Exception {
        Jwt jwt = new Jwt("token-do-usuario", Instant.now(), Instant.now().plusSeconds(60),
                Map.of("alg", "HS256"), Map.of("sub", "usuario@newe.com.br"));
        SecurityContextHolder.getContext().setAuthentication(new JwtAuthenticationToken(jwt));

        executar();

        assertEquals("Bearer token-do-usuario", requisicao.getHeaders().getFirst(HttpHeaders.AUTHORIZATION));
    }

    @Test
    void naoEnviaCabecalhoQuandoNaoHaUsuarioAutenticado() throws Exception {
        executar();

        assertNull(requisicao.getHeaders().getFirst(HttpHeaders.AUTHORIZATION));
    }
}