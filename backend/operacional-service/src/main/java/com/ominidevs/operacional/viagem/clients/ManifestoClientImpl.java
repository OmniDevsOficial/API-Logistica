package com.ominidevs.operacional.viagem.clients;

import java.util.List;
import java.util.Map;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import com.ominidevs.operacional.viagem.dto.ManifestoDTO;

@Component
public class ManifestoClientImpl implements ManifestoClient {

    private final RestClient restClient;

    public ManifestoClientImpl(RestClient restClient) {
        this.restClient = restClient;
    }

    @Override
    public List<ManifestoDTO> enviar(MultipartFile file) {

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", file.getResource());

        List<Map<String, String>> dados = restClient
                .post()
                .uri("/manifestos/upload")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(body)
                .retrieve()
                .body(new ParameterizedTypeReference<List<Map<String, String>>>() {
                });

        if (dados == null || dados.isEmpty()) {
            return List.of();
        }

        return dados.stream()
                .map(d -> {
                    // Se tiver "Origem" no CSV, usa; senão usa fallback
                    String origem = d.get("Filial");
                    if (origem == null || origem.isBlank()) {
                        origem = "Não informado";
                    }

                    return new ManifestoDTO(
                            d.get("Manifesto"),
                            d.get("Data"),
                            d.get("Motorista"),
                            d.get("CPF"),
                            d.get("Veículo"),
                            origem,
                            d.get("Destino"),
                            d.get("Valor Frete"),
                            d.get("Km saída"),
                            d.get("Km chegada"),
                            d.get("Status"),
                            d.get("Observações operacionais")
                    );
                })
                .toList();
    }
}
