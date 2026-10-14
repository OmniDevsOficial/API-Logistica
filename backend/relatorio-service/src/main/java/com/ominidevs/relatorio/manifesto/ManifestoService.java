package com.ominidevs.relatorio.manifesto;

import com.ominidevs.relatorio.manifesto.exception.ArquivoInvalidoException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Locale;
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

    private final ManifestoProcessador processador;

    public ManifestoService(ManifestoProcessador processador) {
        this.processador = processador;
    }

    /**
     * Processa o arquivo de manifesto enviado via upload.
     * O resultado é cacheado pelo formato e pelo SHA-256 do conteúdo dos bytes.
     *
     * @param file arquivo MultipartFile recebido no upload
     * @return dados tabulares em formato List<Map<String, String>>
     */
    public List<Map<String, String>> processarManifesto(MultipartFile file) {
        if (file == null) throw new ArquivoInvalidoException("esse arquivo é inválido");
        // Validar antes do cache impede reutilizar CSV renomeado para um formato inválido.
        String formato = formatoValido(file.getOriginalFilename());
        try {
            byte[] bytes = file.getBytes();
            String hash = calcularHashSHA256(bytes);
            return processador.processarComCache(hash, bytes, formato);
        } catch (IOException e) {
            throw new ArquivoInvalidoException("esse arquivo é inválido", e);
        }
    }

    private String formatoValido(String filename) {
        if (filename == null || !filename.contains(".")) {
            throw new ArquivoInvalidoException("esse arquivo é inválido");
        }
        String formato = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase(Locale.ROOT);
        return switch (formato) {
            case "csv", "xlsx", "xls" -> formato;
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
