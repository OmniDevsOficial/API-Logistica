package com.ominidevs.relatorio.manifesto.parser;

import com.ominidevs.relatorio.manifesto.exception.ArquivoInvalidoException;
import org.junit.jupiter.api.Test;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Workbook;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import static org.junit.jupiter.api.Assertions.*;

class ExcelParserTest {
    private final ExcelParser parser = new ExcelParser();
    private ByteArrayInputStream bytes(Workbook workbook) throws Exception {
        var out = new ByteArrayOutputStream();
        workbook.write(out);
        return new ByteArrayInputStream(out.toByteArray());
    }

    @Test void planilhaVaziaEhInvalida() throws Exception {
        try (var workbook = new XSSFWorkbook()) {
            workbook.createSheet();
            var input = bytes(workbook);
            assertThrows(ArquivoInvalidoException.class, () -> parser.parse(input));
        }
    }
    @Test void workbookSemPlanilhasEhInvalido() throws Exception {
        try (var workbook = new XSSFWorkbook()) {
            var input = bytes(workbook);
            assertThrows(ArquivoInvalidoException.class, () -> parser.parse(input));
        }
    }
    @Test void linhaDeCabecalhoAusenteEhInvalida() throws Exception {
        try (var workbook = new XSSFWorkbook()) {
            workbook.createSheet().createRow(1).createCell(0).setCellValue("Ana");
            var input = bytes(workbook);
            assertThrows(ArquivoInvalidoException.class, () -> parser.parse(input));
        }
    }
    @Test void celulaAusenteViraVazioELinhaAusenteEhIgnorada() throws Exception {
        try (var workbook = new XSSFWorkbook()) {
            var sheet = workbook.createSheet();
            var header = sheet.createRow(0);
            header.createCell(0).setCellValue("nome");
            header.createCell(1).setCellValue("cidade");
            sheet.createRow(2).createCell(0).setCellValue("Ana");
            var dados = parser.parse(bytes(workbook));
            assertEquals(1, dados.size());
            assertEquals("Ana", dados.getFirst().get("nome"));
            assertEquals("", dados.getFirst().get("cidade"));
        }
    }
    @Test void formatoNumericoPreservaZerosIniciais() throws Exception {
        try (var workbook = new XSSFWorkbook()) {
            var sheet = workbook.createSheet();
            sheet.createRow(0).createCell(0).setCellValue("CPF");
            var cell = sheet.createRow(1).createCell(0);
            cell.setCellValue(123456789);
            var style = workbook.createCellStyle();
            style.setDataFormat(workbook.createDataFormat().getFormat("00000000000"));
            cell.setCellStyle(style);
            assertEquals("00123456789", parser.parse(bytes(workbook)).getFirst().get("CPF"));
        }
    }
    @Test void formatoXlsExistenteContinuaSuportado() throws Exception {
        try (var workbook = new HSSFWorkbook()) {
            var sheet = workbook.createSheet();
            sheet.createRow(0).createCell(0).setCellValue("nome");
            sheet.createRow(1).createCell(0).setCellValue("Ana");
            assertEquals("Ana", parser.parse(bytes(workbook)).getFirst().get("nome"));
        }
    }
}
