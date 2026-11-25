package com.ominidevs.operacional.veiculo.entities;

import java.util.LinkedHashMap;
import java.util.Map;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;

@Converter
public class DadosAdicionaisConverter implements AttributeConverter<Map<String, String>, String> {

    private static final JsonMapper JSON = JsonMapper.builder().build();
    private static final TypeReference<LinkedHashMap<String, String>> TIPO = new TypeReference<>() {};

    @Override
    public String convertToDatabaseColumn(Map<String, String> dados) {
        return dados == null || dados.isEmpty() ? null : JSON.writeValueAsString(dados);
    }

    @Override
    public Map<String, String> convertToEntityAttribute(String json) {
        return json == null || json.isBlank() ? Map.of() : JSON.readValue(json, TIPO);
    }
}
