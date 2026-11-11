package com.ominidevs.operacional.veiculo.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import com.ominidevs.operacional.veiculo.exceptions.ArquivoVeiculoInvalidoException;
import com.ominidevs.operacional.veiculo.model.LinhaCsvVeiculo;
import com.ominidevs.operacional.veiculo.model.PlanilhaVeiculos;

class LeitorCsvVeiculoTest {

    /** Cabeçalho real exportado pelo sistema de frota (30 colunas). */
    private static final String CABECALHO_REAL = "Placa;Marca;Modelo;Cor;Combustível;Nº Frota;Ano Fabricação;"
            + "Ano Modelo;Renavam;Chassi;Cidade Licenciamento;Tipo Veículo;Tipo Carroceria;Tipo Proprietário;"
            + "Proprietário;Agregado;Tabela de agregado;Motorista Padrão;Data Compra;Valor Compra;Data Venda;"
            + "Valor Venda;PBT (Peso Bruto Total);Tara (kg);Capacidade (m3);Capacidade Lotação;"
            + "Número Autorização GR;Validade GR;Status do Veículo;Lote para Fechamento do CIOT";

    private final LeitorCsvVeiculo leitor = new LeitorCsvVeiculo();

    private static MockMultipartFile csv(String conteudo, Charset charset) {
        return new MockMultipartFile("file", "veiculos.csv", "text/csv", conteudo.getBytes(charset));
    }

    private static MockMultipartFile csv(String conteudo) {
        return csv(conteudo, Charset.forName("windows-1252"));
    }

    @Test
    void leFormatoRealDoSistemaDeFrotaEmWindows1252() {
        String conteudo = CABECALHO_REAL + "\n"
                + "AAJ3354;Mercedes Benz;\"=\"\"1114\"\"\";BRANCA;Diesel S10;;1987;1988;\"=\"\"00521803225\"\"\";"
                + "9BM344014HB779373;Astorga - PR;Cavalo mecânico;;Agregado;A. F. L. LIMA;A. F. L. LIMA;;"
                + "JOSE  HILTON MENDES ;;0,00;;0,00;1,00;1,00;1,00;0,00;;;Ativo;\n";

        PlanilhaVeiculos planilha = leitor.ler(csv(conteudo));

        assertEquals(List.of(new LinhaCsvVeiculo(2, "AAJ3354", "CAVALO MECÂNICO", "JOSE HILTON MENDES",
                "Mercedes Benz", "1114", "Ativo")), planilha.linhas());
        assertTrue(planilha.possuiMarca());
        assertTrue(planilha.possuiModelo());
        assertTrue(planilha.possuiStatus());
    }

    @Test
    void informaQueColunasOpcionaisNaoVieram() {
        PlanilhaVeiculos planilha = leitor.ler(csv("Placa;Tipo Veículo\nABC1234;VAN\n"));

        assertFalse(planilha.possuiMarca());
        assertFalse(planilha.possuiModelo());
        assertFalse(planilha.possuiStatus());
    }

    @Test
    void normalizaPlacaTipoEFormulaDoExcel() {
        String conteudo = "Placa;Tipo Veículo;Motorista Padrão\n"
                + "\"=\"\"abc-1d23\"\"\"; fiorino ;\"=\"\"Ana\"\"\"\n"
                + " xyz 9876 ;Van;\n";

        List<LinhaCsvVeiculo> linhas = leitor.ler(csv(conteudo)).linhas();

        assertEquals(new LinhaCsvVeiculo(2, "ABC1D23", "FIORINO", "Ana"), linhas.get(0));
        assertEquals(new LinhaCsvVeiculo(3, "XYZ9876", "VAN", null), linhas.get(1));
    }

    @Test
    void comparaCabecalhoSemAcentoSemCaixaEComBomUtf8() {
        String conteudo = "﻿PLACA ; tipo   veiculo;MOTORISTA PADRAO\nABC1234;Toco;Ana\n";

        List<LinhaCsvVeiculo> linhas = leitor.ler(csv(conteudo, StandardCharsets.UTF_8)).linhas();

        assertEquals(List.of(new LinhaCsvVeiculo(2, "ABC1234", "TOCO", "Ana")), linhas);
    }

    @Test
    void aceitaUtf8SemBomComAcentos() {
        String conteudo = "Placa;Tipo Veículo\nABC1234;Automóveis\n";

        List<LinhaCsvVeiculo> linhas = leitor.ler(csv(conteudo, StandardCharsets.UTF_8)).linhas();

        assertEquals("AUTOMÓVEIS", linhas.getFirst().tipo());
    }

    @Test
    void semColunaDeMotoristaLeVeiculosSemVinculo() {
        List<LinhaCsvVeiculo> linhas = leitor.ler(csv("Placa;Tipo Veículo\nABC1234;VAN\n")).linhas();

        assertNull(linhas.getFirst().motorista());
    }

    @Test
    void ignoraLinhasEmBrancoMantendoNumeracaoDaPlanilha() {
        List<LinhaCsvVeiculo> linhas = leitor.ler(csv("Placa;Tipo Veículo\n;\nABC1234;VAN\n\n")).linhas();

        assertEquals(1, linhas.size());
        assertEquals(3, linhas.getFirst().numero());
    }

    @Test
    void preservaCamposVaziosParaValidacaoPorLinha() {
        List<LinhaCsvVeiculo> linhas = leitor.ler(csv("Placa;Tipo Veículo;Motorista\n;VAN;Ana\nABC1234\n")).linhas();

        assertEquals(new LinhaCsvVeiculo(2, null, "VAN", "Ana"), linhas.get(0));
        assertEquals(new LinhaCsvVeiculo(3, "ABC1234", null, null), linhas.get(1));
    }

    @Test
    void listaTodasAsColunasObrigatoriasAusentes() {
        var ex = assertThrows(ArquivoVeiculoInvalidoException.class,
                () -> leitor.ler(csv("Marca;Modelo\nVolvo;FH\n")));

        assertEquals("Colunas obrigatórias ausentes: Placa, Tipo Veículo.", ex.getMessage());
    }

    @Test
    void listaApenasAColunaQueFalta() {
        var ex = assertThrows(ArquivoVeiculoInvalidoException.class,
                () -> leitor.ler(csv("Placa;Tipo Carroceria\nABC1234;Baú\n")));

        assertEquals("Colunas obrigatórias ausentes: Tipo Veículo.", ex.getMessage());
    }

    @Test
    void arquivoSoComCabecalhoEInvalido() {
        var ex = assertThrows(ArquivoVeiculoInvalidoException.class,
                () -> leitor.ler(csv("Placa;Tipo Veículo\n\n")));

        assertEquals("O arquivo não possui veículos para importar.", ex.getMessage());
    }

    @Test
    void arquivoSemConteudoEInvalido() {
        var ex = assertThrows(ArquivoVeiculoInvalidoException.class, () -> leitor.ler(csv("")));

        assertEquals("Nenhum arquivo foi enviado ou o arquivo está vazio.", ex.getMessage());
    }

    @Test
    void arquivoAusenteEInvalido() {
        var ex = assertThrows(ArquivoVeiculoInvalidoException.class, () -> leitor.ler(null));

        assertEquals("Nenhum arquivo foi enviado ou o arquivo está vazio.", ex.getMessage());
    }

    @ParameterizedTest
    @ValueSource(strings = {"veiculos.xlsx", "veiculos.txt", "veiculos"})
    void extensaoDiferenteDeCsvEInvalida(String nome) {
        var arquivo = new MockMultipartFile("file", nome, "text/csv", "Placa;Tipo Veículo\nABC1234;VAN".getBytes());

        var ex = assertThrows(ArquivoVeiculoInvalidoException.class, () -> leitor.ler(arquivo));

        assertEquals("Formato de arquivo inválido. Envie um arquivo .csv.", ex.getMessage());
    }

    @Test
    void extensaoCsvEmMaiusculasEAceita() {
        var arquivo = new MockMultipartFile("file", "VEICULOS.CSV", "text/csv", "Placa;Tipo Veículo\nABC1234;VAN".getBytes());

        assertEquals(1, leitor.ler(arquivo).linhas().size());
    }

    @Test
    void arquivoAcimaDe10MbEInvalido() {
        MultipartFile arquivo = mock(MultipartFile.class);
        when(arquivo.getOriginalFilename()).thenReturn("veiculos.csv");
        when(arquivo.getSize()).thenReturn(LeitorCsvVeiculo.TAMANHO_MAXIMO_BYTES + 1);

        var ex = assertThrows(ArquivoVeiculoInvalidoException.class, () -> leitor.ler(arquivo));

        assertEquals("O arquivo excede o tamanho máximo permitido (10MB).", ex.getMessage());
    }
}
