package com.ominidevs.relatorio.manifesto;

import com.ominidevs.relatorio.manifesto.parser.*;
import com.ominidevs.relatorio.manifesto.exception.ArquivoInvalidoException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.*;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;
import org.springframework.mock.web.MockMultipartFile;
import java.nio.charset.StandardCharsets;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.any;

@SpringJUnitConfig(ManifestoCacheTest.Config.class)
class ManifestoCacheTest {
    @Configuration
    @EnableCaching
    @Import({ManifestoService.class, ManifestoProcessador.class, CsvParser.class, ExcelParser.class})
    static class Config {
        @Bean CacheManager cacheManager() { return new ConcurrentMapCacheManager("manifestos"); }
    }
    @Autowired private ManifestoService service;
    @Autowired private CacheManager cacheManager;
    // Os parsers continuam reais. O spy apenas conta suas chamadas.
    @MockitoSpyBean private CsvParser csv;
    @MockitoSpyBean private ExcelParser excel;

    @BeforeEach void limpar() {
        cacheManager.getCache("manifestos").clear();
        clearInvocations(csv, excel);
    }

    private MockMultipartFile arquivo(String nome, String conteudo) {
        return new MockMultipartFile("file", nome, "application/octet-stream",
                conteudo.getBytes(StandardCharsets.ISO_8859_1));
    }

    @Test void mesmoConteudoENomesDiferentesProcessamUmaVez() {
        var primeiro = service.processarManifesto(arquivo("um.csv", "nome\nAna\n"));
        var segundo = service.processarManifesto(arquivo("dois.CSV", "nome\nAna\n"));
        assertEquals("Ana", segundo.getFirst().get("nome"));
        assertEquals(primeiro, segundo);
        verify(csv, times(1)).parse(any());
        verifyNoInteractions(excel);
    }

    @Test void conteudosDiferentesNaoCompartilhamResultado() {
        service.processarManifesto(arquivo("um.csv", "nome\nAna\n"));
        var resultado = service.processarManifesto(arquivo("um.csv", "nome\nBruno\n"));
        assertEquals("Bruno", resultado.getFirst().get("nome"));
        verify(csv, times(2)).parse(any());
    }

    @Test void limparCacheProvocaNovoProcessamento() {
        service.processarManifesto(arquivo("um.csv", "nome\nAna\n"));
        cacheManager.getCache("manifestos").clear();
        service.processarManifesto(arquivo("um.csv", "nome\nAna\n"));
        verify(csv, times(2)).parse(any());
    }

    @Test void extensaoInvalidaNaoReaproveitaCache() {
        service.processarManifesto(arquivo("um.csv", "nome\nAna\n"));
        assertThrows(ArquivoInvalidoException.class,
                () -> service.processarManifesto(arquivo("um.pdf", "nome\nAna\n")));
        verify(csv, times(1)).parse(any());
    }

    @Test void formatoDiferenteNaoReaproveitaCache() {
        service.processarManifesto(arquivo("um.csv", "nome\nAna\n"));
        assertThrows(ArquivoInvalidoException.class,
                () -> service.processarManifesto(arquivo("um.xlsx", "nome\nAna\n")));
        verify(excel).parse(any());
    }

    @Test void errosNaoSaoArmazenadosNoCache() {
        for (int i = 0; i < 2; i++) {
            assertThrows(ArquivoInvalidoException.class,
                    () -> service.processarManifesto(arquivo("corrompido.xlsx", "invalido")));
        }
        verify(excel, times(2)).parse(any());
    }

    @Test void listaVaziaTambemPodeSerReutilizada() {
        assertTrue(service.processarManifesto(arquivo("um.csv", "nome\n")).isEmpty());
        assertTrue(service.processarManifesto(arquivo("um.csv", "nome\n")).isEmpty());
        verify(csv, times(1)).parse(any());
    }
}
