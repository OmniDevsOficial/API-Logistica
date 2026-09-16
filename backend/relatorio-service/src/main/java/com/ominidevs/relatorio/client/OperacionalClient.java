package com.ominidevs.relatorio.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

// Ponto único por onde o relatorio-service busca dado do operacional-service.
// Nunca acessar o schema "operacional" direto do banco a partir daqui -
// é essa chamada HTTP que substitui o JOIN/FK que existiria se fosse tudo
// o mesmo serviço.
@Component
public class OperacionalClient {

    private final RestClient restClient;

    public OperacionalClient(@Value("${operacional.service.url}") String baseUrl) {
        this.restClient = RestClient.create(baseUrl);
    }

    public String ping() {
        return restClient.get()
                .uri("/motoristas/ping")
                .retrieve()
                .body(String.class);
    }

    // Exemplo de próximo passo: buscar os dados reais de viagens/motoristas
    // aqui, criando um endpoint correspondente no operacional-service e
    // um método aqui que chama esse endpoint (uri "/viagens/{id}" etc.).
}
