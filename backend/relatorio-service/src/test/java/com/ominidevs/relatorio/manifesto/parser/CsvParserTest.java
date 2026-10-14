package com.ominidevs.relatorio.manifesto.parser;

import com.ominidevs.relatorio.manifesto.exception.ArquivoInvalidoException;
import org.junit.jupiter.api.Test;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import static org.junit.jupiter.api.Assertions.*;

class CsvParserTest {
    private final CsvParser parser = new CsvParser();
    private InputStream csv(String conteudo) {
        return new ByteArrayInputStream(conteudo.getBytes(StandardCharsets.ISO_8859_1));
    }

    @Test void somenteCabecalhoRetornaListaVazia() {
        assertTrue(parser.parse(csv("nome;cidade\n")).isEmpty());
    }
    @Test void colunaAusenteViraStringVazia() {
        var dados = parser.parse(csv("nome;cidade\nAna\n"));
        assertEquals("Ana", dados.getFirst().get("nome"));
        assertEquals("", dados.getFirst().get("cidade"));
    }
    @Test void separadorDentroDeAspasPermaneceNoValor() {
        var dados = parser.parse(csv("nome;observacao\nAna;\"coleta; entrega\"\n"));
        assertEquals("coleta; entrega", dados.getFirst().get("observacao"));
    }
    @Test void aspasNaoFechadasGeramErro() {
        assertThrows(ArquivoInvalidoException.class,
                () -> parser.parse(csv("nome;cidade\n\"Ana;Campinas\n")));
    }
    @Test void falhaDeLeituraViraErroDeArquivo() {
        InputStream quebrado = new InputStream() {
            @Override public int read() throws IOException { throw new IOException("Falha de leitura"); }
        };
        assertThrows(ArquivoInvalidoException.class, () -> parser.parse(quebrado));
    }
}
