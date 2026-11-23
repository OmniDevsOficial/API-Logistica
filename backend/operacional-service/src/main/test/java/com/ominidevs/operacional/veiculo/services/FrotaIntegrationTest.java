package com.ominidevs.operacional.veiculo.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;
import java.nio.charset.Charset;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.transaction.annotation.Transactional;

import com.ominidevs.operacional.indicadores.model.PeriodoConsulta;
import com.ominidevs.operacional.veiculo.dto.PaginaResponse;
import com.ominidevs.operacional.veiculo.dto.ResumoFrotaResponse;
import com.ominidevs.operacional.veiculo.dto.ResumoFrotaResponse.PercentualPorCombustivel;
import com.ominidevs.operacional.veiculo.dto.ResumoFrotaResponse.QuantidadePorMarca;
import com.ominidevs.operacional.veiculo.dto.ResumoFrotaResponse.QuantidadePorTipo;
import com.ominidevs.operacional.veiculo.dto.VeiculoFrotaResponse;
import com.ominidevs.operacional.veiculo.exceptions.ParametroFrotaInvalidoException;

import com.ominidevs.operacional.viagem.entities.StatusViagem;
import com.ominidevs.operacional.viagem.entities.Viagem;

import jakarta.persistence.EntityManager;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE, properties = {
        "spring.datasource.url=jdbc:tc:postgresql:17-alpine:///frota?currentSchema=operacional",
        "spring.datasource.driver-class-name=org.testcontainers.jdbc.ContainerDatabaseDriver",
        "spring.datasource.username=test",
        "spring.datasource.password=test",
        "spring.jpa.hibernate.ddl-auto=validate",
        "spring.jpa.properties.hibernate.default_schema=operacional",
        "spring.flyway.schemas=operacional",
        "spring.flyway.create-schemas=true"
})
@Transactional
class FrotaIntegrationTest {

    @Autowired private FrotaService frota;
    @Autowired private ImportacaoVeiculoService importacao;
    @Autowired private JdbcTemplate jdbc;
    @Autowired private EntityManager entityManager;

    private static final String CSV = """
            Placa;Marca;Modelo;Combustível;Tipo Veículo;Motorista Padrão;Cor;Renavam
            EKO2F09;Volvo;VM260;Diesel;Truck;JOSE HILTON MENDES;Branca;123
            AAJ3354;Mercedes Benz;1114;Diesel;Cavalo mecânico;Maykon Zambonini;;
            AAJ3355;Randon;SR;;Semi-reboque;MAYKON ZAMBONINI;;
            HNF5D31;FIAT;FIORINO;Flex;Fiorino;;Prata;
            """;

    private void importarFrota() {
        importacao.importar(new MockMultipartFile("file", "veiculos.csv", "text/csv",
                CSV.getBytes(Charset.forName("windows-1252"))));
        jdbc.update("INSERT INTO operacional.veiculo (placa, tipo) VALUES ('ZZZ9Z99', NULL)");
        entityManager.flush();
        entityManager.clear();
    }

    private static List<String> placas(PaginaResponse<VeiculoFrotaResponse> pagina) {
        return pagina.itens().stream().map(VeiculoFrotaResponse::placa).toList();
    }

    @Test
    void semVeiculosRetornaResumoZeradoEListaVazia() {
        ResumoFrotaResponse resumo = frota.resumir(null);
        PaginaResponse<VeiculoFrotaResponse> pagina = frota.listar(0, 20, null, null, null);

        assertFalse(resumo.possuiDados());
        assertEquals(0, resumo.totalVeiculos());
        assertEquals(0, resumo.veiculosSemMotorista());
        assertEquals(0, resumo.motoristasComVeiculo());
        assertTrue(resumo.porTipo().isEmpty());
        assertTrue(resumo.porCombustivel().isEmpty());
        assertTrue(resumo.porMarca().isEmpty());
        assertTrue(pagina.itens().isEmpty());
        assertEquals(0, pagina.totalItens());
    }

    @Test
    void resumeTotaisTiposCombustiveisEMarcas() {
        importarFrota();

        ResumoFrotaResponse resumo = frota.resumir(null);

        assertTrue(resumo.possuiDados());
        assertEquals(5, resumo.totalVeiculos());
        assertEquals(2, resumo.veiculosSemMotorista());
        assertEquals(2, resumo.motoristasComVeiculo());
        assertEquals(5, resumo.porTipo().size());
        assertTrue(resumo.porTipo().contains(new QuantidadePorTipo("NAO_IDENTIFICADO", 1)));
        assertTrue(resumo.porTipo().contains(new QuantidadePorTipo("CAVALO MECÂNICO", 1)));
        assertEquals(List.of(
                new PercentualPorCombustivel("DIESEL", 2, new BigDecimal("40.0")),
                new PercentualPorCombustivel("NAO_IDENTIFICADO", 2, new BigDecimal("40.0")),
                new PercentualPorCombustivel("FLEX", 1, new BigDecimal("20.0"))), resumo.porCombustivel());
        assertEquals(List.of(
                new QuantidadePorMarca("MERCEDES BENZ", 1),
                new QuantidadePorMarca("RANDON", 1),
                new QuantidadePorMarca("VOLVO", 1)), resumo.porMarca());
    }

    @Test
    void listaPaginadaOrdenadaPorPlacaComPlacaFormatada() {
        importarFrota();

        PaginaResponse<VeiculoFrotaResponse> primeira = frota.listar(0, 2, null, null, null);
        PaginaResponse<VeiculoFrotaResponse> segunda = frota.listar(1, 2, null, null, null);

        assertEquals(List.of("AAJ-3354", "AAJ-3355"), placas(primeira));
        assertEquals(List.of("EKO-2F09", "HNF-5D31"), placas(segunda));
        assertEquals(5, primeira.totalItens());
        assertEquals(3, primeira.totalPaginas());
    }

    @Test
    void devolveMotoristaOuNuloEDadosGravadosPelaImportacao() {
        importarFrota();

        List<VeiculoFrotaResponse> itens = frota.listar(0, 20, null, null, null).itens();
        VeiculoFrotaResponse eko = itens.get(2);
        VeiculoFrotaResponse hnf = itens.get(3);

        assertEquals("JOSE HILTON MENDES", eko.motorista());
        assertEquals("TRUCK", eko.tipo());
        assertEquals("DIESEL", eko.combustivel());
        assertEquals(Map.of("Cor", "Branca"), eko.dadosAdicionais());
        assertNotNull(eko.atualizadoEm());
        assertNull(hnf.motorista());
        assertEquals(Map.of("Cor", "Prata"), hnf.dadosAdicionais());
    }

    @Test
    void buscaPorPlacaComOuSemHifenEPorNomeDoMotorista() {
        importarFrota();

        assertEquals(List.of("AAJ-3354", "AAJ-3355"), placas(frota.listar(0, 20, null, "aaj-335", null)));
        assertEquals(List.of("EKO-2F09"), placas(frota.listar(0, 20, null, "eko2f", null)));
        assertEquals(List.of("AAJ-3354", "AAJ-3355"), placas(frota.listar(0, 20, null, "  maykon ", null)));
        assertEquals(List.of("EKO-2F09"), placas(frota.listar(0, 20, null, "hilton", null)));
        assertTrue(frota.listar(0, 20, null, "100%", null).itens().isEmpty());
    }

    @Test
    void filtraPorTipoInclusiveNaoIdentificado() {
        importarFrota();

        assertEquals(List.of("HNF-5D31"), placas(frota.listar(0, 20, "fiorino", null, null)));
        assertEquals(List.of("ZZZ-9Z99"), placas(frota.listar(0, 20, "NAO_IDENTIFICADO", null, null)));
        assertEquals(List.of("AAJ-3354"), placas(frota.listar(0, 20, "Cavalo Mecânico", "maykon", null)));
    }

    private static final PeriodoConsulta SETEMBRO =
            new PeriodoConsulta(LocalDate.of(2026, 9, 1), LocalDate.of(2026, 9, 30));

    private void viagem(String placa, LocalDate data) {
        entityManager.persist(new Viagem("MAN-" + placa + data, data, "JOSE HILTON MENDES", "001.234.567-89",
                placa, "Campinas", "Santos", new BigDecimal("100.00"), null, null,
                StatusViagem.FINALIZADO, null, null));
    }

    private void importarFrotaComViagens() {
        importarFrota();
        viagem("eko-2f09", LocalDate.of(2026, 9, 1));
        viagem("EKO2F09", LocalDate.of(2026, 9, 30));
        viagem("HNF 5D31", LocalDate.of(2026, 9, 15));
        viagem("AAJ3354", LocalDate.of(2026, 10, 1));
        viagem("XYZ9999", LocalDate.of(2026, 9, 10));
        entityManager.flush();
        entityManager.clear();
    }

    @Test
    void comPeriodoListaSoVeiculosComViagemNoPeriodo() {
        importarFrotaComViagens();

        PaginaResponse<VeiculoFrotaResponse> pagina = frota.listar(0, 20, null, null, SETEMBRO);

        assertEquals(List.of("EKO-2F09", "HNF-5D31"), placas(pagina));
        assertEquals(2, pagina.totalItens());
        assertEquals(List.of("HNF-5D31"), placas(frota.listar(0, 20, "fiorino", null, SETEMBRO)));
    }

    @Test
    void comPeriodoResumeSoVeiculosComViagemNoPeriodo() {
        importarFrotaComViagens();

        ResumoFrotaResponse resumo = frota.resumir(SETEMBRO);

        assertTrue(resumo.possuiDados());
        assertEquals(2, resumo.totalVeiculos());
        assertEquals(1, resumo.veiculosSemMotorista());
        assertEquals(1, resumo.motoristasComVeiculo());
        assertEquals(List.of(new QuantidadePorMarca("VOLVO", 1)), resumo.porMarca());
        assertEquals(List.of(
                new PercentualPorCombustivel("DIESEL", 1, new BigDecimal("50.0")),
                new PercentualPorCombustivel("FLEX", 1, new BigDecimal("50.0"))), resumo.porCombustivel());
    }

    @Test
    void periodoSemViagensRetornaResumoZerado() {
        importarFrotaComViagens();
        PeriodoConsulta janeiro = new PeriodoConsulta(LocalDate.of(2026, 1, 1), LocalDate.of(2026, 1, 31));

        ResumoFrotaResponse resumo = frota.resumir(janeiro);

        assertFalse(resumo.possuiDados());
        assertEquals(0, resumo.totalVeiculos());
        assertTrue(resumo.porTipo().isEmpty());
        assertTrue(frota.listar(0, 20, null, null, janeiro).itens().isEmpty());
    }

    @Test
    void periodoPrecisaDasDuasDatasValidas() {
        assertNull(FrotaService.periodo(null, " "));
        assertEquals(SETEMBRO, FrotaService.periodo("01/09/2026", "30/09/2026"));
        assertThrows(ParametroFrotaInvalidoException.class, () -> FrotaService.periodo("01/09/2026", null));
        assertThrows(RuntimeException.class, () -> FrotaService.periodo("2026-09-01", "30/09/2026"));
    }

    @Test
    void rejeitaPaginacaoForaDosLimites() {
        assertThrows(ParametroFrotaInvalidoException.class, () -> frota.listar(-1, 20, null, null, null));
        assertThrows(ParametroFrotaInvalidoException.class, () -> frota.listar(0, 0, null, null, null));
        assertThrows(ParametroFrotaInvalidoException.class, () -> frota.listar(0, 101, null, null, null));
    }
}
