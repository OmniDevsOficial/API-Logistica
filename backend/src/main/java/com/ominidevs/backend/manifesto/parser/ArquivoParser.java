package com.ominidevs.backend.manifesto.parser;

import com.ominidevs.backend.manifesto.exception.ArquivoInvalidoException;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

/**
 * Contrato comum para parsers de arquivos de manifesto.
 * Cada implementação é responsável por um formato específico (CSV, XLSX, etc.).
 */
public interface ArquivoParser {

    /**
     * Faz o parse do conteúdo do arquivo e retorna uma lista de linhas,
     * onde cada linha é um mapa coluna → valor (ambos como String).
     *
     * @param inputStream stream do conteúdo do arquivo
     * @return dados tabulares genéricos
     * @throws ArquivoInvalidoException se o arquivo for inválido ou corrompido
     */
    List<Map<String, String>> parse(InputStream inputStream);
}
