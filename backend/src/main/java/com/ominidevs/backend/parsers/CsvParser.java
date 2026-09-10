package com.ominidevs.backend.parsers;

import com.ominidevs.backend.exceptions.ArquivoInvalidoException;
import com.opencsv.CSVParser;
import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvException;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Parser de arquivos CSV utilizando OpenCSV.
 * Assume que a primeira linha é o cabeçalho (nomes das colunas).
 */
@Component
public class CsvParser implements ArquivoParser {

    @Override
    public List<Map<String, String>> parse(InputStream inputStream) {
        
        // Define o ponto e vírgula como separador
        CSVParser parser = new CSVParserBuilder()
                .withSeparator(';')
                .build();

        // Utiliza ISO_8859_1 para preservar a acentuação do Windows/Excel
        try (CSVReader reader = new CSVReaderBuilder(new InputStreamReader(inputStream, StandardCharsets.ISO_8859_1))
                .withCSVParser(parser)
                .build()) {

            List<String[]> allRows = reader.readAll();

            if (allRows.isEmpty()) {
                throw new ArquivoInvalidoException("esse arquivo é inválido");
            }

            String[] headers = allRows.getFirst();
            List<Map<String, String>> result = new ArrayList<>();

            for (int i = 1; i < allRows.size(); i++) {
                String[] row = allRows.get(i);
                Map<String, String> rowMap = new LinkedHashMap<>();
                for (int j = 0; j < headers.length; j++) {
                    String value = (j < row.length) ? row[j] : "";
                    rowMap.put(headers[j], value);
                }
                result.add(rowMap);
            }

            return result;

        } catch (ArquivoInvalidoException e) {
            throw e;
        } catch (CsvException | java.io.IOException e) {
            throw new ArquivoInvalidoException("esse arquivo é inválido", e);
        }
    }
}