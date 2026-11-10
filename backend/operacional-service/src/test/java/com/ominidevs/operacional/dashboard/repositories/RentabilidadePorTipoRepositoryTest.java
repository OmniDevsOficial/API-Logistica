package com.ominidevs.operacional.dashboard.repositories;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.SingleConnectionDataSource;

import com.ominidevs.operacional.dashboard.projections.RentabilidadeTipoVeiculo;
import com.ominidevs.operacional.dashboard.projections.ValoresFinanceirosViagem;
import com.ominidevs.operacional.indicadores.model.PeriodoConsulta;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class RentabilidadePorTipoRepositoryTest {

    private final PeriodoConsulta janeiro = PeriodoConsulta.doMesObrigatorio("2026-01");
    private final PeriodoConsulta fevereiro = PeriodoConsulta.doMesObrigatorio("2026-02");

    private Connection connection;
    private JdbcTemplate jdbc;
    private DashboardRepository repository;

    @BeforeEach
    void preparar() throws Exception {
        connection = DriverManager.getConnection("jdbc:tc:postgresql:17-alpine:///rentabilidade_por_tipo");
        connection.setAutoCommit(false);
        jdbc = new JdbcTemplate(new SingleConnectionDataSource(connection, true));
        jdbc.execute("CREATE SCHEMA operacional");
        jdbc.execute("""
                CREATE TABLE operacional.viagem (
                    data DATE, veiculo TEXT,
                    receita_frete NUMERIC(12,2), vale_frete NUMERIC(12,2))
                """);
        jdbc.execute("""
                CREATE TABLE operacional.veiculo (
                    placa VARCHAR(7) UNIQUE, tipo VARCHAR(50))
                """);
        jdbc.execute("""
                INSERT INTO operacional.veiculo VALUES
                ('ABC1D23', 'TRUCK'),
                ('DEF4G56', 'CARRETA'),
                ('GHI7J89', NULL),
                ('JKL0M12', '  ')
                """);
        repository = new DashboardRepository(jdbc);
    }

    @AfterEach
    void desfazer() throws Exception {
        if (connection != null) {
            connection.rollback();
            connection.close();
        }
    }

    private void viagem(String data, String placa, String receita, String valeFrete) {
        jdbc.update("INSERT INTO operacional.viagem VALUES (CAST(? AS date), ?, CAST(? AS numeric), CAST(? AS numeric))",
                data, placa, receita, valeFrete);
    }

    private RentabilidadeTipoVeiculo tipo(List<RentabilidadeTipoVeiculo> linhas, String tipo) {
        return linhas.stream().filter(l -> l.tipo().equals(tipo)).findFirst().orElseThrow();
    }

    @Test
    void agrupaPorTipoCasandoAPlacaEmQualquerFormato() {
        viagem("2026-01-05", "ABC-1D23", "1000.00", "600.00");
        viagem("2026-01-06", "abc1d23", "500.00", "100.00");
        viagem("2026-01-07", " DEF 4G56 ", "800.00", "300.00");

        List<RentabilidadeTipoVeiculo> linhas = repository.consultarRentabilidadePorTipo(janeiro);

        assertEquals(2, linhas.size());
        RentabilidadeTipoVeiculo truck = tipo(linhas, "TRUCK");
        assertEquals(2, truck.viagens());
        assertEquals(new BigDecimal("1500.00"), truck.receita());
        assertEquals(new BigDecimal("700.00"), truck.custo());
        RentabilidadeTipoVeiculo carreta = tipo(linhas, "CARRETA");
        assertEquals(1, carreta.viagens());
        assertEquals(new BigDecimal("800.00"), carreta.receita());
        assertEquals(new BigDecimal("300.00"), carreta.custo());
    }

    @Test
    void respeitaABordaEntreJaneiroEFevereiro() {
        viagem("2025-12-31", "ABC1D23", "9999.00", "0.00");
        viagem("2026-01-01", "ABC1D23", "100.00", "0.00");
        viagem("2026-01-31", "ABC1D23", "200.00", "0.00");
        viagem("2026-02-01", "ABC1D23", "400.00", "0.00");
        viagem("2026-02-28", "ABC1D23", "800.00", "0.00");
        viagem("2026-03-01", "ABC1D23", "9999.00", "0.00");

        RentabilidadeTipoVeiculo noJaneiro = tipo(repository.consultarRentabilidadePorTipo(janeiro), "TRUCK");
        RentabilidadeTipoVeiculo noFevereiro = tipo(repository.consultarRentabilidadePorTipo(fevereiro), "TRUCK");

        assertEquals(2, noJaneiro.viagens());
        assertEquals(new BigDecimal("300.00"), noJaneiro.receita());
        assertEquals(2, noFevereiro.viagens());
        assertEquals(new BigDecimal("1200.00"), noFevereiro.receita());
    }

    @Test
    void placaSemTipoCaiEmNaoIdentificadoSemSumirDaSoma() {
        viagem("2026-01-05", "ABC1D23", "1000.00", "400.00");
        viagem("2026-01-06", "ZZZ9Z99", "300.00", "100.00");
        viagem("2026-01-07", "GHI7J89", "200.00", "50.00");
        viagem("2026-01-08", "JKL0M12", "100.00", "25.00");
        viagem("2026-01-09", null, "50.00", "10.00");
        viagem("2026-01-10", "   ", "40.00", "5.00");

        List<RentabilidadeTipoVeiculo> linhas = repository.consultarRentabilidadePorTipo(janeiro);

        RentabilidadeTipoVeiculo naoIdentificado = tipo(linhas, DashboardRepository.TIPO_NAO_IDENTIFICADO);
        assertEquals(5, naoIdentificado.viagens());
        assertEquals(new BigDecimal("690.00"), naoIdentificado.receita());
        assertEquals(new BigDecimal("190.00"), naoIdentificado.custo());
        assertEquals(6, linhas.stream().mapToLong(RentabilidadeTipoVeiculo::viagens).sum());
    }

    @Test
    void somaDosTiposBateComOsTotaisDosCards() {
        viagem("2026-01-05", "ABC1D23", "1000.00", "400.00");
        viagem("2026-01-06", "DEF4G56", "300.00", "900.00");
        viagem("2026-01-07", "ZZZ9Z99", null, "50.00");
        viagem("2026-01-08", "ABC1D23", "100.00", null);
        viagem("2026-01-09", null, null, null);

        List<RentabilidadeTipoVeiculo> linhas = repository.consultarRentabilidadePorTipo(janeiro);
        List<ValoresFinanceirosViagem> cards = repository.consultarValoresFinanceiros(janeiro);

        BigDecimal receitaDosCards = cards.stream().map(ValoresFinanceirosViagem::receita)
                .filter(v -> v != null).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal custoDosCards = cards.stream().map(ValoresFinanceirosViagem::valeFrete)
                .filter(v -> v != null).reduce(BigDecimal.ZERO, BigDecimal::add);

        assertEquals(cards.size(), linhas.stream().mapToLong(RentabilidadeTipoVeiculo::viagens).sum());
        assertEquals(receitaDosCards, linhas.stream().map(RentabilidadeTipoVeiculo::receita)
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        assertEquals(custoDosCards, linhas.stream().map(RentabilidadeTipoVeiculo::custo)
                .reduce(BigDecimal.ZERO, BigDecimal::add));
    }

    @Test
    void ordenaPelaRentabilidadeComNaoIdentificadoPorUltimoEMantemNegativos() {
        viagem("2026-01-05", "ZZZ9Z99", "5000.00", "0.00");
        viagem("2026-01-06", "ABC1D23", "100.00", "900.00");
        viagem("2026-01-07", "DEF4G56", "1000.00", "200.00");

        List<RentabilidadeTipoVeiculo> linhas = repository.consultarRentabilidadePorTipo(janeiro);

        assertEquals(List.of("CARRETA", "TRUCK", DashboardRepository.TIPO_NAO_IDENTIFICADO),
                linhas.stream().map(RentabilidadeTipoVeiculo::tipo).toList());
        RentabilidadeTipoVeiculo truck = tipo(linhas, "TRUCK");
        assertTrue(truck.receita().subtract(truck.custo()).signum() < 0);
    }

    @Test
    void mesSemViagensDevolveListaVazia() {
        viagem("2026-02-01", "ABC1D23", "100.00", "0.00");

        assertTrue(repository.consultarRentabilidadePorTipo(janeiro).isEmpty());
    }
}
