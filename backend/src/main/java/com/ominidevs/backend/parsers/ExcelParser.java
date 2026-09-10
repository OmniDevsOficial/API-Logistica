package com.ominidevs.backend.parsers;

import com.ominidevs.backend.exceptions.ArquivoInvalidoException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Parser de arquivos Excel (.xlsx / .xls) utilizando Apache POI.
 * Assume que a primeira linha é o cabeçalho (nomes das colunas).
 */
@Component
public class ExcelParser implements ArquivoParser {

    private final DataFormatter dataFormatter = new DataFormatter();

    @Override
    public List<Map<String, String>> parse(InputStream inputStream) {
        try (Workbook workbook = WorkbookFactory.create(inputStream)) {

            Sheet sheet = workbook.getSheetAt(0);

            if (sheet == null || sheet.getPhysicalNumberOfRows() == 0) {
                throw new ArquivoInvalidoException("esse arquivo é inválido");
            }

            Row headerRow = sheet.getRow(0);
            if (headerRow == null) {
                throw new ArquivoInvalidoException("esse arquivo é inválido");
            }

            // Extrair nomes das colunas do cabeçalho
            List<String> headers = new ArrayList<>();
            for (int j = 0; j < headerRow.getLastCellNum(); j++) {
                Cell cell = headerRow.getCell(j);
                headers.add(cell != null ? getCellValueAsString(cell) : "");
            }

            // Extrair dados das linhas restantes
            List<Map<String, String>> result = new ArrayList<>();
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    continue;
                }

                Map<String, String> rowMap = new LinkedHashMap<>();
                for (int j = 0; j < headers.size(); j++) {
                    Cell cell = row.getCell(j);
                    String value = (cell != null) ? getCellValueAsString(cell) : "";
                    rowMap.put(headers.get(j), value);
                }
                result.add(rowMap);
            }

            return result;

        } catch (ArquivoInvalidoException e) {
            throw e;
        } catch (Exception e) {
            throw new ArquivoInvalidoException("esse arquivo é inválido", e);
        }
    }

    private String getCellValueAsString(Cell cell) {
        if (cell.getCellType() == CellType.NUMERIC) {
            // Usar DataFormatter para preservar o formato original (evitar notação científica)
            return dataFormatter.formatCellValue(cell);
        }
        return dataFormatter.formatCellValue(cell);
    }
}
