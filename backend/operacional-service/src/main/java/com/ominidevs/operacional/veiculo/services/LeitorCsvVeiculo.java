package com.ominidevs.operacional.veiculo.services;

import java.io.IOException;
import java.io.StringReader;
import java.nio.ByteBuffer;
import java.nio.charset.CharacterCodingException;
import java.nio.charset.Charset;
import java.nio.charset.CodingErrorAction;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.ominidevs.operacional.motorista.model.NomeMotorista;
import com.ominidevs.operacional.veiculo.exceptions.ArquivoVeiculoInvalidoException;
import com.ominidevs.operacional.veiculo.model.LinhaCsvVeiculo;
import com.ominidevs.operacional.veiculo.model.Placa;
import com.ominidevs.operacional.veiculo.model.PlanilhaVeiculos;
import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.ICSVParser;
import com.opencsv.exceptions.CsvValidationException;

/**
 * Lê o CSV de veículos exportado pelo sistema de frota.
 *
 * <p>Valida o arquivo como um todo (extensão, tamanho, conteúdo e cabeçalho)
 * e devolve as linhas normalizadas. A validação de cada linha fica com
 * {@link ImportacaoVeiculoService}, para que uma linha ruim não derrube as
 * demais.
 */
@Component
public class LeitorCsvVeiculo {

    /** Limite de 10 MB, o mesmo do multipart em application.yml. */
    static final long TAMANHO_MAXIMO_BYTES = 10L * 1024 * 1024;

    static final String COLUNA_PLACA = "Placa";
    static final String COLUNA_TIPO = "Tipo Veículo";
    private static final List<String> COLUNAS_MOTORISTA = List.of("Motorista Padrão", "Motorista");
    private static final String COLUNA_MARCA = "Marca";
    private static final String COLUNA_MODELO = "Modelo";
    private static final List<String> COLUNAS_STATUS = List.of("Status do Veículo", "Status");

    /** Excel no Windows grava em windows-1252 (superconjunto do ISO-8859-1). */
    private static final Charset CHARSET_EXCEL = Charset.forName("windows-1252");

    /**
     * Valida e lê o arquivo enviado.
     *
     * @param arquivo CSV enviado no campo {@code file}.
     * @return linhas normalizadas (sem linhas em branco) e as colunas opcionais presentes.
     * @throws ArquivoVeiculoInvalidoException se o arquivo não puder ser importado.
     */
    public PlanilhaVeiculos ler(MultipartFile arquivo) {
        validarArquivo(arquivo);
        String conteudo = decodificar(lerBytes(arquivo));

        try (CSVReader leitor = new CSVReaderBuilder(new StringReader(conteudo))
                .withCSVParser(new CSVParserBuilder()
                        .withSeparator(separador(conteudo))
                        // Sem escape por barra invertida: o padrão CSV usa aspas duplicadas ("").
                        .withEscapeChar(ICSVParser.NULL_CHARACTER)
                        .build())
                .build()) {

            String[] cabecalho = leitor.readNext();
            if (cabecalho == null || linhaEmBranco(cabecalho)) {
                throw new ArquivoVeiculoInvalidoException("O arquivo está vazio.");
            }

            Map<String, Integer> indices = indexarCabecalho(cabecalho);
            validarColunasObrigatorias(indices);
            int colunaPlaca = indices.get(chaveColuna(COLUNA_PLACA));
            int colunaTipo = indices.get(chaveColuna(COLUNA_TIPO));
            Integer colunaMotorista = primeiraColunaPresente(indices, COLUNAS_MOTORISTA);
            Integer colunaMarca = primeiraColunaPresente(indices, List.of(COLUNA_MARCA));
            Integer colunaModelo = primeiraColunaPresente(indices, List.of(COLUNA_MODELO));
            Integer colunaStatus = primeiraColunaPresente(indices, COLUNAS_STATUS);

            List<LinhaCsvVeiculo> linhas = new ArrayList<>();
            int numero = 1;
            String[] campos;
            while ((campos = leitor.readNext()) != null) {
                numero++;
                if (linhaEmBranco(campos)) {
                    continue;
                }
                linhas.add(new LinhaCsvVeiculo(
                        numero,
                        normalizarPlaca(campo(campos, colunaPlaca)),
                        normalizarTipo(campo(campos, colunaTipo)),
                        texto(campos, colunaMotorista),
                        texto(campos, colunaMarca),
                        texto(campos, colunaModelo),
                        texto(campos, colunaStatus)));
            }

            if (linhas.isEmpty()) {
                throw new ArquivoVeiculoInvalidoException("O arquivo não possui veículos para importar.");
            }
            return new PlanilhaVeiculos(linhas, colunaMarca != null, colunaModelo != null, colunaStatus != null);

        } catch (CsvValidationException | IOException ex) {
            throw new ArquivoVeiculoInvalidoException("Não foi possível ler o arquivo CSV.", ex);
        }
    }

    /**
     * Placa: remove fórmula do Excel, espaços e hífens e coloca em maiúsculas.
     *
     * @param valor valor bruto da célula.
     * @return placa normalizada, ou {@code null} se vazia.
     */
    static String normalizarPlaca(String valor) {
        return Placa.normalizar(limparFormulaExcel(valor));
    }

    /** Texto livre: remove fórmula do Excel e espaços extras, sem mudar a caixa. */
    private static String texto(String[] campos, Integer indice) {
        return indice == null ? null : NomeMotorista.limpar(limparFormulaExcel(campo(campos, indice)));
    }

    /**
     * Tipo: remove fórmula do Excel, espaços nas pontas e repetidos e coloca em
     * maiúsculas ("Fiorino" vira "FIORINO"). Acentos são mantidos.
     *
     * @param valor valor bruto da célula.
     * @return tipo normalizado, ou {@code null} se vazio.
     */
    static String normalizarTipo(String valor) {
        String limpo = NomeMotorista.limpar(limparFormulaExcel(valor));
        return limpo == null ? null : limpo.toUpperCase(Locale.ROOT);
    }

    /**
     * Remove a formatação ="valor" que o Excel usa para preservar zeros à
     * esquerda, como já é feito na leitura do manifesto.
     */
    static String limparFormulaExcel(String valor) {
        if (valor == null) {
            return null;
        }
        String limpo = valor.strip();
        if (limpo.length() >= 3 && limpo.startsWith("=\"") && limpo.endsWith("\"")) {
            limpo = limpo.substring(2, limpo.length() - 1).strip();
        }
        return limpo;
    }

    private void validarArquivo(MultipartFile arquivo) {
        if (arquivo == null || arquivo.isEmpty()) {
            throw new ArquivoVeiculoInvalidoException("Nenhum arquivo foi enviado ou o arquivo está vazio.");
        }
        String nome = arquivo.getOriginalFilename();
        if (nome == null || !nome.strip().toLowerCase(Locale.ROOT).endsWith(".csv")) {
            throw new ArquivoVeiculoInvalidoException("Formato de arquivo inválido. Envie um arquivo .csv.");
        }
        if (arquivo.getSize() > TAMANHO_MAXIMO_BYTES) {
            throw new ArquivoVeiculoInvalidoException("O arquivo excede o tamanho máximo permitido (10MB).");
        }
    }

    private byte[] lerBytes(MultipartFile arquivo) {
        try {
            return arquivo.getBytes();
        } catch (IOException ex) {
            throw new ArquivoVeiculoInvalidoException("Não foi possível ler o arquivo CSV.", ex);
        }
    }

    /**
     * Aceita UTF-8 (com ou sem BOM) e, se o conteúdo não for UTF-8 válido,
     * cai para windows-1252, que é o que o Excel e o sistema de frota geram.
     */
    private String decodificar(byte[] bytes) {
        String texto;
        try {
            texto = StandardCharsets.UTF_8.newDecoder()
                    .onMalformedInput(CodingErrorAction.REPORT)
                    .onUnmappableCharacter(CodingErrorAction.REPORT)
                    .decode(ByteBuffer.wrap(bytes))
                    .toString();
        } catch (CharacterCodingException ex) {
            texto = new String(bytes, CHARSET_EXCEL);
        }
        return texto.startsWith("﻿") ? texto.substring(1) : texto;
    }

    /** O padrão é ";", mas aceita "," quando o cabeçalho não tem ";". */
    private char separador(String conteudo) {
        int fimPrimeiraLinha = conteudo.indexOf('\n');
        String primeiraLinha = fimPrimeiraLinha < 0 ? conteudo : conteudo.substring(0, fimPrimeiraLinha);
        return primeiraLinha.indexOf(';') < 0 && primeiraLinha.indexOf(',') >= 0 ? ',' : ';';
    }

    private Map<String, Integer> indexarCabecalho(String[] cabecalho) {
        Map<String, Integer> indices = new HashMap<>();
        for (int i = 0; i < cabecalho.length; i++) {
            indices.putIfAbsent(chaveColuna(cabecalho[i]), i);
        }
        return indices;
    }

    private void validarColunasObrigatorias(Map<String, Integer> indices) {
        List<String> ausentes = new ArrayList<>();
        for (String coluna : List.of(COLUNA_PLACA, COLUNA_TIPO)) {
            if (!indices.containsKey(chaveColuna(coluna))) {
                ausentes.add(coluna);
            }
        }
        if (!ausentes.isEmpty()) {
            throw new ArquivoVeiculoInvalidoException(
                    "Colunas obrigatórias ausentes: " + String.join(", ", ausentes) + ".");
        }
    }

    private static Integer primeiraColunaPresente(Map<String, Integer> indices, List<String> nomes) {
        return nomes.stream()
                .map(LeitorCsvVeiculo::chaveColuna)
                .filter(indices::containsKey)
                .map(indices::get)
                .findFirst()
                .orElse(null);
    }

    /** Compara nomes de coluna sem acento, sem caixa e sem espaços extras. */
    static String chaveColuna(String nome) {
        String limpo = NomeMotorista.limpar(nome == null ? null : nome.replace("﻿", ""));
        if (limpo == null) {
            return "";
        }
        return Normalizer.normalize(limpo, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT);
    }

    private static String campo(String[] campos, int indice) {
        return indice < campos.length ? campos[indice] : null;
    }

    private static boolean linhaEmBranco(String[] campos) {
        for (String campo : campos) {
            if (campo != null && !campo.isBlank()) {
                return false;
            }
        }
        return true;
    }
}
