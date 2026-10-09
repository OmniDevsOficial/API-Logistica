package com.ominidevs.relatorio.manifesto;

import com.ominidevs.relatorio.config.GlobalExceptionHandler;
import com.ominidevs.relatorio.manifesto.parser.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.any;

class ManifestoControllerTest {
    private MockMvc mvc;

    @BeforeEach void configurar() {
        // Serviço e parsers reais; o cache com contexto Spring é testado em ManifestoCacheTest.
        var service = new ManifestoService(new ManifestoProcessador(new CsvParser(), new ExcelParser()));
        mvc = MockMvcBuilders.standaloneSetup(new ManifestoController(service))
                .setControllerAdvice(new GlobalExceptionHandler()).build();
    }

    @Test void uploadCsvRetornaJsonComColunasEValores() throws Exception {
        var file = new MockMultipartFile("file", "dados.csv", "text/csv",
                "Motorista;CPF\nJoão;00123456789\n".getBytes(StandardCharsets.ISO_8859_1));
        mvc.perform(multipart("/manifestos/upload").file(file))
                .andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].Motorista").value("João"))
                .andExpect(jsonPath("$[0].CPF").value("00123456789"));
    }

    @Test void uploadExcelRetornaJson() throws Exception {
        try (var workbook = new XSSFWorkbook(); var out = new ByteArrayOutputStream()) {
            var sheet = workbook.createSheet();
            sheet.createRow(0).createCell(0).setCellValue("Manifesto");
            sheet.createRow(1).createCell(0).setCellValue("M1");
            workbook.write(out);
            mvc.perform(multipart("/manifestos/upload").file(new MockMultipartFile(
                    "file", "dados.xlsx", "application/octet-stream", out.toByteArray())))
                    .andExpect(status().isOk()).andExpect(jsonPath("$[0].Manifesto").value("M1"));
        }
    }

    @Test void arquivoCorrompidoRetorna400() throws Exception {
        mvc.perform(multipart("/manifestos/upload").file(new MockMultipartFile(
                "file", "dados.xlsx", "application/octet-stream", new byte[]{1})))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("esse arquivo é inválido"));
    }

    @Test void arquivoVazioRetorna400() throws Exception {
        mvc.perform(multipart("/manifestos/upload").file(new MockMultipartFile(
                "file", "dados.csv", "text/csv", new byte[0])))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("esse arquivo é inválido"));
    }

    @Test void extensaoNaoSuportadaRetorna400() throws Exception {
        mvc.perform(multipart("/manifestos/upload").file(new MockMultipartFile(
                "file", "dados.txt", "text/plain", new byte[]{1})))
                .andExpect(status().isBadRequest());
    }

    @Test void arquivoAusenteRetorna400() throws Exception {
        mvc.perform(multipart("/manifestos/upload")).andExpect(status().isBadRequest());
    }

    @Test void cabecalhoSemLinhasRetornaListaVazia() throws Exception {
        mvc.perform(multipart("/manifestos/upload").file(new MockMultipartFile(
                "file", "dados.csv", "text/csv", "nome\n".getBytes(StandardCharsets.ISO_8859_1))))
                .andExpect(status().isOk()).andExpect(content().json("[]"));
    }

    @Test void tamanhoExcedidoRetorna413() throws Exception {
        // Valida o handler. MockMvc não aplica o limite multipart do servidor.
        var service = mock(ManifestoService.class);
        when(service.processarManifesto(any())).thenThrow(new MaxUploadSizeExceededException(10L * 1024 * 1024));
        var mockMvc = MockMvcBuilders.standaloneSetup(new ManifestoController(service))
                .setControllerAdvice(new GlobalExceptionHandler()).build();
        mockMvc.perform(multipart("/manifestos/upload").file(new MockMultipartFile(
                "file", "dados.csv", "text/csv", new byte[]{1})))
                .andExpect(status().isPayloadTooLarge())
                .andExpect(jsonPath("$.erro").value("o arquivo excede o tamanho máximo permitido (10MB)"));
    }
}
