package com.ominidevs.backend.services;

import com.ominidevs.backend.exceptions.ArquivoInvalidoException;
import com.ominidevs.backend.parsers.ArquivoParser;
import com.ominidevs.backend.parsers.CsvParser;
import com.ominidevs.backend.parsers.ExcelParser;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;

/**
 * Serviço responsável pelo processamento de arquivos de manifesto.
 * Calcula o hash SHA-256 do conteúdo para usar como chave de cache,
 * delega ao parser apropriado conforme a extensão do arquivo.
 */
@Service
public class ManifestoService {

    private final CsvParser csvParser;
    private final ExcelParser excelParser;

    public ManifestoService(CsvParser csvParser, ExcelParser excelParser) {
        this.csvParser = csvParser;
        this.excelParser = excelParser;
    }

    /**
     * Processa o arquivo de manifesto enviado via upload.
     * O resultado é cacheado pela chave SHA-256 do conteúdo dos bytes.
     *
     * @param file arquivo MultipartFile recebido no upload
     * @return dados tabulares em formato List<Map<String, String>>
     */
    public List<Map<String, String>> processarManifesto(MultipartFile file) {
        try {
            byte[] bytes = file.getBytes();
            String hash = calcularHashSHA256(bytes);
            return processarComCache(hash, bytes, file.getOriginalFilename());
        } catch (IOException e) {
            throw new ArquivoInvalidoException("esse arquivo é inválido", e);
        }
    }

    /**
     * Método cacheável separado — a chave é o hash SHA-256 (String),
     * nunca o MultipartFile (que não é serializável).
     */
    @Cacheable(value = "manifestos", key = "#hash")
    public List<Map<String, String>> processarComCache(String hash, byte[] bytes, String filename) {
        ArquivoParser parser = resolverParser(filename);
        return parser.parse(new ByteArrayInputStream(bytes));
    }

    /**
     * Resolve qual parser usar com base na extensão do nome do arquivo.
     */
    ArquivoParser resolverParser(String filename) {
        if (filename == null || !filename.contains(".")) {
            throw new ArquivoInvalidoException("esse arquivo é inválido");
        }

        String extensao = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();

        return switch (extensao) {
            case "csv" -> csvParser;
            case "xlsx", "xls" -> excelParser;
            default -> throw new ArquivoInvalidoException("esse arquivo é inválido");
        };
    }

    /**
     * Calcula o hash SHA-256 dos bytes do arquivo.
     */
    String calcularHashSHA256(byte[] bytes) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(bytes);
            return HexFormat.of().formatHex(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            throw new ArquivoInvalidoException("esse arquivo é inválido", e);
        }
    }
}
