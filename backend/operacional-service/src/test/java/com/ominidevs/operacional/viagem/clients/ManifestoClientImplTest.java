package com.ominidevs.operacional.viagem.clients;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.ResourceAccessException;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.*;
import static org.springframework.test.web.client.response.MockRestResponseCreators.*;
import static org.hamcrest.Matchers.containsString;

class ManifestoClientImplTest {
    private MockRestServiceServer server;
    private ManifestoClientImpl client;
    private final MockMultipartFile file = new MockMultipartFile(
            "file", "manifesto.csv", "text/csv", "Manifesto;Data\nM1;01/10/2026".getBytes(StandardCharsets.UTF_8));

    @BeforeEach void configurar() {
        var builder = RestClient.builder().baseUrl("http://relatorio.test");
        // HTTP simulado, usando a serialização e leitura de JSON reais do RestClient.
        server = MockRestServiceServer.bindTo(builder).build();
        client = new ManifestoClientImpl(builder.build());
    }

    @Test void enviaMultipartEMapeiaColunasDoRelatorio() {
        server.expect(requestTo("http://relatorio.test/manifestos/upload"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(content().contentTypeCompatibleWith(MediaType.MULTIPART_FORM_DATA))
                .andExpect(content().string(containsString("name=\"file\"")))
                .andExpect(content().string(containsString("filename=\"manifesto.csv\"")))
                .andExpect(content().string(containsString("M1;01/10/2026")))
                .andRespond(withSuccess("""
                        [{"Manifesto":"M1","Data":"01/10/2026","Motorista":"Ana","CPF":"00123456789",
                        "Veículo":"ABC1D23","Origem":"São Paulo","Destino":"Campinas","Valor Frete":"1.500,50",
                        "Km saída":"100","Km chegada":"250","Status":"Finalizado","Observações operacionais":"Teste"}]
                        """, MediaType.APPLICATION_JSON));
        var dados = client.enviar(file);
        assertEquals(1, dados.size());
        var dto = dados.getFirst();
        assertEquals("M1", dto.getManifesto());
        assertEquals("01/10/2026", dto.getData());
        assertEquals("Ana", dto.getMotorista());
        assertEquals("00123456789", dto.getCPF());
        assertEquals("ABC1D23", dto.getVeiculo());
        assertEquals("São Paulo", dto.getOrigem());
        assertEquals("Campinas", dto.getDestino());
        assertEquals("1.500,50", dto.getValorFrete());
        assertEquals("100", dto.getKmSaida());
        assertEquals("250", dto.getKmChegada());
        assertEquals("Finalizado", dto.getStatus());
        assertEquals("Teste", dto.getObservacoes());
        server.verify();
    }

    @ParameterizedTest
    @ValueSource(strings = {"[{}]", "[{\"Origem\":\"\"}]", "[{\"Origem\":\"   \"}]"})
    void aplicaFallbackQuandoOrigemNaoInformada(String json) {
        server.expect(requestTo("http://relatorio.test/manifestos/upload"))
                .andRespond(withSuccess(json, MediaType.APPLICATION_JSON));
        var dto = client.enviar(file).getFirst();
        assertEquals("Não informado", dto.getOrigem());
        assertNull(dto.getDestino());
        server.verify();
    }

    @ParameterizedTest
    @ValueSource(strings = {"[]", "null"})
    void respostaSemDadosRetornaListaVazia(String json) {
        server.expect(requestTo("http://relatorio.test/manifestos/upload"))
                .andRespond(withSuccess(json, MediaType.APPLICATION_JSON));
        assertTrue(client.enviar(file).isEmpty());
        server.verify();
    }

    @ParameterizedTest
    @ValueSource(ints = {400, 413, 500, 503})
    void propagaErroHttpDoRelatorio(int status) {
        server.expect(requestTo("http://relatorio.test/manifestos/upload"))
                .andRespond(withStatus(HttpStatus.valueOf(status)));
        var erro = assertThrows(RestClientResponseException.class, () -> client.enviar(file));
        assertEquals(status, erro.getStatusCode().value());
        server.verify();
    }

    @Test void falhaDeRedeNaoViraSucessoVazio() {
        server.expect(requestTo("http://relatorio.test/manifestos/upload"))
                .andRespond(withException(new IOException("Sem conexão")));
        assertThrows(ResourceAccessException.class, () -> client.enviar(file));
        server.verify();
    }

    @Test void jsonInvalidoNaoViraSucessoVazio() {
        server.expect(requestTo("http://relatorio.test/manifestos/upload"))
                .andRespond(withSuccess("json inválido", MediaType.APPLICATION_JSON));
        assertThrows(RestClientException.class, () -> client.enviar(file));
        server.verify();
    }
}
