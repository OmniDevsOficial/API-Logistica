package com.ominidevs.operacional.viagem.clients;

import com.ominidevs.operacional.viagem.dto.ManifestoDTO;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Component
public class ManifestoClientImpl implements ManifestoClient {

    private final RestClient restClient;

    public ManifestoClientImpl(RestClient restClient) {
        this.restClient = restClient;
    }

    @Override
    public List<ManifestoDTO> enviar(MultipartFile file) {

        MultiValueMap<String, Object> body =
                new LinkedMultiValueMap<>();

        body.add("file", file.getResource());

        List<Map<String, String>> dados = restClient
                .post()
                .uri("/manifestos/upload")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(body)
                .retrieve()
                .body(
                        new ParameterizedTypeReference<
                                List<Map<String, String>>
                        >() {}
                );

        if (dados == null || dados.isEmpty()) {
            return List.of();
        }

        return dados.stream()
                .map(this::converterParaDTO)
                .toList();
    }

    private ManifestoDTO converterParaDTO(Map<String, String> dados) {

        return new ManifestoDTO(
                dados.get("Manifesto"),
                dados.get("Data"),
                dados.get("Motorista"),
                dados.get("CPF"),
                dados.get("Veículo"),
                dados.get("Destino"),
                dados.get("Valor Frete"),
                dados.get("Km saída"),
                dados.get("Km chegada"),
                dados.get("Status"),
                dados.get("Observações operacionais")
        );
    }
}