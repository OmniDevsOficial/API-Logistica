package com.ominidevs.relatorio.client;

import com.sun.net.httpserver.HttpServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestClientResponseException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.atomic.AtomicReference;
import static org.junit.jupiter.api.Assertions.*;

class OperacionalClientTest {
    private HttpServer server;
    private OperacionalClient client;
    private final AtomicReference<String> request = new AtomicReference<>();

    @BeforeEach void iniciarServidorLocal() throws Exception {
        // Servidor HTTP apenas em loopback e porta aleatória, sem acessar o serviço real.
        server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        client = new OperacionalClient("http://127.0.0.1:" + server.getAddress().getPort());
    }
    @AfterEach void parar() { server.stop(0); }

    private void responder(int status, String body) {
        server.createContext("/", exchange -> {
            request.set(exchange.getRequestMethod() + " " + exchange.getRequestURI().getPath());
            byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "text/plain; charset=UTF-8");
            exchange.sendResponseHeaders(status, bytes.length);
            try (var out = exchange.getResponseBody()) { out.write(bytes); }
        });
        server.start();
    }

    @Test void pingUsaRotaCorretaERetornaResposta() {
        responder(200, "operacional-service ativo");
        assertEquals("operacional-service ativo", client.ping());
        assertEquals("GET /motoristas/ping", request.get());
    }
    @Test void erroHttpNaoViraMensagemDeSucesso() {
        responder(503, "indisponível");
        var erro = assertThrows(RestClientResponseException.class, () -> client.ping());
        assertEquals(503, erro.getStatusCode().value());
    }
}
