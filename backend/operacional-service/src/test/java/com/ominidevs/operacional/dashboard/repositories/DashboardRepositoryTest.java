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

import com.ominidevs.operacional.dashboard.model.AgrupamentoSerie;
import com.ominidevs.operacional.dashboard.projections.DestinoRentavel;
import com.ominidevs.operacional.dashboard.projections.PontoRentabilidade;
import com.ominidevs.operacional.dashboard.projections.PontoSerie;
import com.ominidevs.operacional.dashboard.projections.ResumoViagens;
import com.ominidevs.operacional.dashboard.projections.ValoresFinanceirosViagem;
import com.ominidevs.operacional.indicadores.model.PeriodoConsulta;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class DashboardRepositoryTest {

    private final PeriodoConsulta setembro = PeriodoConsulta.parse("01/09/2026", "30/09/2026");

    private Connection connection;
    private JdbcTemplate jdbc;
    private DashboardRepository repository;

    @BeforeEach
    void preparar() throws Exception {
        connection = DriverManager.getConnection("jdbc:tc:postgresql:17-alpine:///dashboard");
        connection.setAutoCommit(false);
        jdbc = new JdbcTemplate(new SingleConnectionDataSource(connection, true));
        jdbc.execute("CREATE SCHEMA operacional");
        jdbc.execute("""
                CREATE TABLE operacional.viagem (
                    data DATE, motorista TEXT, cpf_motorista TEXT, veiculo TEXT,
                    valor_frete NUMERIC(10,2), km_saida INT, km_chegada INT, status TEXT,
                    receita_frete NUMERIC(12,2), custo_frete NUMERIC(12,2), pedagio NUMERIC(12,2),
                    vale_frete NUMERIC(12,2),
                    cidade_destino TEXT)
                """);
        jdbc.execute("""
                INSERT INTO operacional.viagem VALUES
                ('2026-09-01', 'Ana', '001.234.567-89', 'Truck', 1000.00, 100, 600, 'FINALIZADO'),
                ('2026-09-10', 'Ana', '00123456789', 'Truck', 500.00, NULL, NULL, 'PENDENTE'),
                ('2026-09-10', 'Bruno', '11111111111', NULL, 250.50, 10, 60, 'EM_TRANSITO'),
                ('2026-09-30', 'Sem CPF', NULL, '   ', 249.50, NULL, 70, 'PENDENTE'),
                ('2026-08-31', 'Antes', '22222222222', 'Van', 9999.99, 0, 10, 'FINALIZADO'),
                ('2026-10-01', 'Depois', '33333333333', 'Van', 8888.88, 0, 10, 'FINALIZADO')
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

    @Test
    void resumoConsideraSomenteOPeriodoEIgnoraValoresAusentes() {
        ResumoViagens resumo = repository.consultarResumo(setembro);

        assertEquals(4, resumo.totalViagens());
        assertEquals(550L, resumo.kmTotal());
        assertEquals(2, resumo.motoristasAtivos());
        assertEquals(1, resumo.veiculosUtilizados());
        assertEquals(2, resumo.viagensPendentes());
        assertEquals(1, resumo.viagensEmTransito());
        assertEquals(1, resumo.viagensFinalizadas());
    }

    @Test
    void periodoSemViagensVoltaZeradoComValoresNulos() {
        ResumoViagens resumo = repository.consultarResumo(
                PeriodoConsulta.parse("01/07/2026", "31/07/2026"));

        assertEquals(0, resumo.totalViagens());
        assertNull(resumo.kmTotal());
        assertEquals(0, resumo.motoristasAtivos());
    }

    @Test
    void serieDeRentabilidadePorDiaTrazTodosOsDiasDoPeriodoComDiaSemViagemZerado() {
        jdbc.update("""
                INSERT INTO operacional.viagem (data, receita_frete, custo_frete, pedagio, vale_frete) VALUES
                ('2026-09-10', 1000.00, 400.00, 30.00, 650.00),
                ('2026-09-30', 300.00, NULL, NULL, 500.00)
                """);

        List<PontoRentabilidade> serie = repository.consultarSerieRentabilidade(setembro, AgrupamentoSerie.DIA);

        assertEquals(30, serie.size());
        assertEquals("01/09", serie.get(0).rotulo());
        assertEquals("30/09", serie.get(29).rotulo());
        assertEquals(3, serie.get(9).viagens());
        assertEquals(0, new BigDecimal("350.00").compareTo(serie.get(9).rentabilidade()));
        assertEquals(0, new BigDecimal("650.00").compareTo(serie.get(9).custo()));
        assertEquals(0, new BigDecimal("500.00").compareTo(serie.get(29).custo()));
        assertEquals(0, serie.get(1).viagens());
        assertEquals(0, BigDecimal.ZERO.compareTo(serie.get(1).custo()));
        assertEquals(0, BigDecimal.ZERO.compareTo(serie.get(1).rentabilidade()));
        assertEquals(0, new BigDecimal("-200.00").compareTo(serie.get(29).rentabilidade()));
    }

    @Test
    void serieDeRentabilidadePorMesAgrupaOsMesesDoPeriodoEmOrdem() {
        jdbc.update("""
                INSERT INTO operacional.viagem (data, receita_frete, vale_frete) VALUES
                ('2026-09-15', 1000.00, 650.00)
                """);

        List<PontoRentabilidade> serie = repository.consultarSerieRentabilidade(
                PeriodoConsulta.parse("01/08/2026", "31/10/2026"), AgrupamentoSerie.MES);

        assertEquals(List.of("08/2026", "09/2026", "10/2026"),
                serie.stream().map(PontoRentabilidade::rotulo).toList());
        assertEquals(List.of(1L, 5L, 1L), serie.stream().map(PontoRentabilidade::viagens).toList());
        assertEquals(0, new BigDecimal("350.00").compareTo(serie.get(1).rentabilidade()));
    }

    @Test
    void seriePorVeiculoAgrupaNuloEVazioComoSemVeiculo() {
        List<PontoSerie> serie = repository.consultarSeriePorVeiculo(setembro);

        assertEquals(2, serie.size());
        assertEquals(2L, viagensDe(serie, "Truck"));
        assertEquals(2L, viagensDe(serie, "SEM_VEICULO"));
    }

    @Test
    void valoresFinanceirosTrazemSomenteViagensDoPeriodoMantendoCamposVazios() {
        jdbc.update("""
                UPDATE operacional.viagem SET receita_frete = 1500.00, vale_frete = 950.00
                WHERE data IN ('2026-09-01', '2026-08-31')
                """);

        List<ValoresFinanceirosViagem> valores = repository.consultarValoresFinanceiros(setembro);

        assertEquals(4, valores.size());
        assertTrue(valores.contains(new ValoresFinanceirosViagem(
                new BigDecimal("1500.00"), new BigDecimal("950.00"))));
        assertEquals(3, valores.stream()
                .filter(v -> v.receita() == null && v.valeFrete() == null)
                .count());
    }

    @Test
    void destinoMaisRentavelEOQueSomaMaisRentabilidadeNoPeriodoENaoOQueTemMaiorMedia() {
        jdbc.update("""
                INSERT INTO operacional.viagem (data, cidade_destino, receita_frete, vale_frete) VALUES
                ('2026-09-02', 'São Paulo', 1000.00, 700.00),
                ('2026-09-03', ' São Paulo ', 800.00, 500.00),
                ('2026-09-04', 'Belém', 2000.00, 1500.00),
                ('2026-08-31', 'Manaus', 9000.00, 100.00),
                ('2026-09-05', '   ', 9000.00, 100.00)
                """);

        DestinoRentavel destino = repository.consultarDestinoMaisRentavel(setembro);

        assertEquals("São Paulo", destino.destino());
        assertEquals(2, destino.viagens());
        assertEquals(new BigDecimal("600.00"), destino.rentabilidadeTotal());
    }

    @Test
    void destinoMaisRentavelFicaNuloQuandoNenhumDestinoTemValorFinanceiro() {
        jdbc.update("""
                INSERT INTO operacional.viagem (data, cidade_destino) VALUES ('2026-09-06', 'Recife')
                """);

        assertNull(repository.consultarDestinoMaisRentavel(setembro));
    }

    private long viagensDe(List<PontoSerie> serie, String rotulo) {
        return serie.stream().filter(ponto -> rotulo.equals(ponto.rotulo()))
                .mapToLong(PontoSerie::viagens).sum();
    }
}
