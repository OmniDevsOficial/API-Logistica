package com.ominidevs.relatorio.manifesto;

import com.ominidevs.relatorio.manifesto.exception.ArquivoInvalidoException;
import com.ominidevs.relatorio.manifesto.parser.CsvParser;
import com.ominidevs.relatorio.manifesto.parser.ExcelParser;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.Map;

/** Outro bean permite que a chamada atravesse o proxy de cache do Spring. */
@Service
public class ManifestoProcessador {
    private final CsvParser csvParser;
    private final ExcelParser excelParser;

    public ManifestoProcessador(CsvParser csvParser, ExcelParser excelParser) {
        this.csvParser = csvParser;
        this.excelParser = excelParser;
    }

    // O formato participa da chave: bytes de CSV não podem reutilizar o resultado de Excel.
    @Cacheable(value = "manifestos", key = "#p2 + ':' + #p0")
    public List<Map<String, String>> processarComCache(String hash, byte[] bytes, String formato) {
        var input = new ByteArrayInputStream(bytes);
        return switch (formato) {
            case "csv" -> csvParser.parse(input);
            case "xlsx", "xls" -> excelParser.parse(input);
            default -> throw new ArquivoInvalidoException("esse arquivo é inválido");
        };
    }
}
