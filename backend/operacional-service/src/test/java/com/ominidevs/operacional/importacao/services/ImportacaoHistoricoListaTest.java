package com.ominidevs.operacional.importacao.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.transaction.annotation.Transactional;

import com.ominidevs.operacional.importacao.dto.FiltroImportacao;
import com.ominidevs.operacional.importacao.dto.ResumoImportacao;
import com.ominidevs.operacional.importacao.entities.ImportacaoHistorico;
import com.ominidevs.operacional.importacao.entities.StatusImportacao;
import com.ominidevs.operacional.importacao.entities.TipoImportacao;
import com.ominidevs.operacional.importacao.repositories.ImportacaoHistoricoRepository;

/**
 * Consulta do histórico em PostgreSQL descartável, com as migrations reais.
 * Docker obrigatório; não ignora testes.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE, properties = {
        "spring.datasource.url=jdbc:tc:postgresql:17-alpine:///historico?currentSchema=operacional",
        "spring.datasource.driver-class-name=org.testcontainers.jdbc.ContainerDatabaseDriver",
        "spring.datasource.username=test",
        "spring.datasource.password=test",
        "spring.jpa.hibernate.ddl-auto=validate",
        "spring.jpa.properties.hibernate.default_schema=operacional",
        "spring.flyway.schemas=operacional",
        "spring.flyway.create-schemas=true"
})
@Transactional
class ImportacaoHistoricoListaTest {

    @Autowired private ImportacaoHistoricoService service;
    @Autowired private ImportacaoHistoricoRepository repository;

    private final MockMultipartFile manifesto =
            new MockMultipartFile("file", "manifesto-novembro.csv", "text/csv", "Manifesto;CPF".getBytes(StandardCharsets.UTF_8));
    private final MockMultipartFile frota =
            new MockMultipartFile("file", "frota-novembro.csv", "text/csv", "Placa;Tipo Veiculo".getBytes(StandardCharsets.UTF_8));

    @BeforeEach
    void limpar() {
        repository.deleteAll();
    }

    private ImportacaoHistorico gravar(
            TipoImportacao tipo, StatusImportacao status, OffsetDateTime dataHora, String arquivo) {
        return repository.save(new ImportacaoHistorico(
                tipo, dataHora, arquivo, "Yuri", status, 2, 1, 0, 1, null, null));
    }

    private List<String> arquivos(FiltroImportacao filtro) {
        return service.listar(filtro).stream().map(linha -> linha.arquivo()).toList();
    }

    @Test
    void listaTudoEmOrdemDecrescenteDeDataHora() {
        gravar(TipoImportacao.MANIFESTO, StatusImportacao.SUCESSO,
                OffsetDateTime.of(2026, 11, 10, 9, 0, 0, 0, ZoneOffset.ofHours(-3)), "manifesto-1.csv");
        gravar(TipoImportacao.MANIFESTO, StatusImportacao.PARCIAL,
                OffsetDateTime.of(2026, 11, 12, 10, 0, 0, 0, ZoneOffset.ofHours(-3)), "manifesto-2.csv");
        gravar(TipoImportacao.VEICULO, StatusImportacao.SUCESSO,
                OffsetDateTime.of(2026, 11, 12, 11, 0, 0, 0, ZoneOffset.ofHours(-3)), "frota-1.csv");
        gravar(TipoImportacao.VEICULO, StatusImportacao.ERRO,
                OffsetDateTime.of(2026, 9, 1, 8, 0, 0, 0, ZoneOffset.ofHours(-3)), "frota-velha.csv");

        assertEquals(
                List.of("frota-1.csv", "manifesto-2.csv", "manifesto-1.csv", "frota-velha.csv"),
                arquivos(new FiltroImportacao(null, null, null, null)));
    }

    @Test
    void filtraPorTipoStatusEPeriodo() {
        gravar(TipoImportacao.MANIFESTO, StatusImportacao.SUCESSO,
                OffsetDateTime.of(2026, 11, 10, 9, 0, 0, 0, ZoneOffset.ofHours(-3)), "manifesto-1.csv");
        gravar(TipoImportacao.MANIFESTO, StatusImportacao.PARCIAL,
                OffsetDateTime.of(2026, 11, 12, 10, 0, 0, 0, ZoneOffset.ofHours(-3)), "manifesto-2.csv");
        gravar(TipoImportacao.VEICULO, StatusImportacao.SUCESSO,
                OffsetDateTime.of(2026, 11, 12, 11, 0, 0, 0, ZoneOffset.ofHours(-3)), "frota-1.csv");
        gravar(TipoImportacao.VEICULO, StatusImportacao.ERRO,
                OffsetDateTime.of(2026, 9, 1, 8, 0, 0, 0, ZoneOffset.ofHours(-3)), "frota-velha.csv");

        assertEquals(List.of("frota-1.csv", "frota-velha.csv"),
                arquivos(new FiltroImportacao(TipoImportacao.VEICULO, null, null, null)));

        assertEquals(List.of("frota-1.csv", "manifesto-1.csv"),
                arquivos(new FiltroImportacao(null, StatusImportacao.SUCESSO, null, null)));

        // "de" e "ate" são inclusos nos dois extremos.
        assertEquals(List.of("frota-1.csv", "manifesto-2.csv"),
                arquivos(new FiltroImportacao(null, null,
                        LocalDate.of(2026, 11, 11), LocalDate.of(2026, 11, 12))));

        assertEquals(List.of("manifesto-2.csv"),
                arquivos(new FiltroImportacao(TipoImportacao.MANIFESTO, null,
                        LocalDate.of(2026, 11, 11), LocalDate.of(2026, 11, 12))));

        assertTrue(arquivos(new FiltroImportacao(null, null,
                LocalDate.of(2026, 11, 12), LocalDate.of(2026, 11, 10))).isEmpty());
    }

    @Test
    void devolveResumoUsuarioEStatusDeCadaLinha() {
        gravar(TipoImportacao.VEICULO, StatusImportacao.PARCIAL,
                OffsetDateTime.of(2026, 11, 12, 11, 0, 0, 0, ZoneOffset.ofHours(-3)), "frota-1.csv");

        var linha = service.listar(new FiltroImportacao(null, null, null, null)).getFirst();

        assertEquals(TipoImportacao.VEICULO, linha.tipo());
        assertEquals(StatusImportacao.PARCIAL, linha.status());
        assertEquals("Yuri", linha.usuario());
        assertEquals(new ResumoImportacao(2, 1, 0, 1), linha.resumo());
        assertEquals(OffsetDateTime.of(2026, 11, 12, 11, 0, 0, 0, ZoneOffset.ofHours(-3)), linha.dataHora());
    }

    @Test
    void reimportarOMesmoConteudoMarcaAImportacaoAnterior() {
        service.registrar(TipoImportacao.VEICULO, frota, new ResumoImportacao(4, 0, 0, 0));
        OffsetDateTime primeira = service.listar(new FiltroImportacao(TipoImportacao.VEICULO, null, null, null))
                .getFirst().dataHora();

        // Mesmo arquivo com outro nome: o conteúdo é o que identifica o reenvio.
        MockMultipartFile renomeado = new MockMultipartFile(
                "file", "frota-copia.csv", "text/csv", "Placa;Tipo Veiculo".getBytes(StandardCharsets.UTF_8));
        service.registrar(TipoImportacao.VEICULO, renomeado, new ResumoImportacao(4, 0, 0, 0));

        var linhas = service.listar(new FiltroImportacao(TipoImportacao.VEICULO, null, null, null));
        assertEquals(2, linhas.size());
        assertEquals("frota-copia.csv", linhas.getFirst().arquivo());
        assertNotNull(linhas.getFirst().reimportacaoDe());
        assertEquals(primeira, linhas.getFirst().reimportacaoDe());
        assertNull(linhas.getLast().reimportacaoDe());
    }

    @Test
    void conteudoDiferenteNaoMarcaReimportacao() {
        service.registrar(TipoImportacao.MANIFESTO, manifesto, new ResumoImportacao(4, 0, 0, 0));
        service.registrar(TipoImportacao.VEICULO, frota, new ResumoImportacao(4, 0, 0, 0));

        var linhas = service.listar(new FiltroImportacao(null, null, null, null));
        linhas.forEach(linha -> assertNull(linha.reimportacaoDe()));
    }
}
