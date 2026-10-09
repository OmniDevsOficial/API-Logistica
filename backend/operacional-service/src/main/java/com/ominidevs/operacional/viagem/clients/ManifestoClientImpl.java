package com.ominidevs.operacional.viagem.clients;

import java.util.List;
import java.util.Map;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.ResourceAccessException;
import com.ominidevs.operacional.viagem.exceptions.IntegracaoManifestoException;
import static com.ominidevs.operacional.viagem.exceptions.IntegracaoManifestoException.Falha.*;
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

        List<Map<String, String>> dados;
        try {
            dados = restClient
                .post()
                .uri("/manifestos/upload")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(body)
                .retrieve()
                .body(new ParameterizedTypeReference<List<Map<String, String>>>() {
                });
        } catch (RestClientResponseException ex) {
            // Classifica a falha sem expor HTML, stack traces ou mensagens internas do relatório.
            var falha = switch (ex.getStatusCode().value()) {
                case 400, 415, 422 -> ARQUIVO_INVALIDO;
                case 413 -> TAMANHO_EXCEDIDO;
                case 429, 500, 502, 503, 504 -> INDISPONIVEL;
                default -> RESPOSTA_INVALIDA;
            };
            throw new IntegracaoManifestoException(falha, ex);
        } catch (ResourceAccessException ex) {
            throw new IntegracaoManifestoException(INDISPONIVEL, ex);
        } catch (RestClientException ex) {
            throw new IntegracaoManifestoException(RESPOSTA_INVALIDA, ex);
        }

        // Lista vazia é válida; corpo ausente ou linha nula viola o contrato do relatório.
        if (dados == null || dados.stream().anyMatch(java.util.Objects::isNull)) {
            throw new IntegracaoManifestoException(RESPOSTA_INVALIDA, null);
        }
        if (dados.isEmpty()) {
            return List.of();
        }

        return dados.stream()
                .map(d -> {
                    // Se tiver "Origem" no CSV, usa; senão usa fallback
                    String origem = d.get("Origem");
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
