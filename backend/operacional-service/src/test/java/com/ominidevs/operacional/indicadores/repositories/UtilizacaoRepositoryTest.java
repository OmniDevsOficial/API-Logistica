package com.ominidevs.operacional.indicadores.repositories;

import java.sql.Connection;
import java.sql.DriverManager;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.SingleConnectionDataSource;
import com.ominidevs.operacional.indicadores.model.PeriodoConsulta;
import static org.junit.jupiter.api.Assertions.*;

// Integração opcional com PostgreSQL DESCARTÁVEL, separado do banco do projeto.
// Configure INDICADORES_TEST_URL, INDICADORES_TEST_USER e INDICADORES_TEST_PASSWORD.
// DDL e dados ficam numa transação revertida ao final de cada teste.
@EnabledIfEnvironmentVariable(named = "INDICADORES_TEST_URL", matches = ".+")
class UtilizacaoRepositoryTest {
    private Connection connection;
    private UtilizacaoRepository repository;

    @BeforeEach void preparar() throws Exception {
        connection = DriverManager.getConnection(System.getenv("INDICADORES_TEST_URL"),
                System.getenv("INDICADORES_TEST_USER"), System.getenv("INDICADORES_TEST_PASSWORD"));
        connection.setAutoCommit(false);
        var jdbc = new JdbcTemplate(new SingleConnectionDataSource(connection, true));
        // Falha se o schema já existir: nunca reutilizar o banco da aplicação neste teste.
        jdbc.execute("CREATE SCHEMA operacional");
        jdbc.execute("CREATE TABLE operacional.motorista (id INTEGER, nome TEXT, cpf TEXT)");
        jdbc.execute("CREATE TABLE operacional.viagem (data DATE, motorista TEXT, cpf_motorista TEXT, status TEXT)");
        jdbc.execute("""
                INSERT INTO operacional.motorista VALUES
                (1, 'Ana', '00123456789'), (2, 'Carlos', '99999999999');
                INSERT INTO operacional.viagem VALUES
                ('2026-09-01', 'ANA', '001.234.567-89', 'PENDENTE'),
                ('2026-09-01', 'Ana Silva', '00123456789', 'FINALIZADO'),
                ('2026-09-10', 'Bruno', '11111111111', 'EM_TRANSITO'),
                ('2026-09-10', 'Sem CPF', NULL, 'PENDENTE'),
                ('2026-09-10', 'Outro sem CPF', '', 'FINALIZADO'),
                ('2026-08-31', 'Ana', '00123456789', 'PENDENTE'),
                ('2026-09-11', 'Bruno', '11111111111', 'PENDENTE')
                """);
        repository = new UtilizacaoRepository(jdbc);
    }

    @AfterEach void desfazer() throws Exception {
        if (connection != null) {
            try { connection.rollback(); } finally { connection.close(); }
        }
    }

    @Test void agrupaPorCpfIncluiLimitesTodosStatusECadastroSemViagens() {
        var dados = repository.consultar(PeriodoConsulta.parse("01/09/2026", "10/09/2026"));
        assertEquals(4, dados.size());
        assertEquals(5, dados.stream().mapToLong(d -> d.quantidadeViagens()).sum());
        var ana = dados.stream().filter(d -> d.chave().equals("00123456789")).findFirst().orElseThrow();
        assertEquals(2, ana.quantidadeViagens());
        assertEquals(1, ana.motoristaId());
        assertEquals("Ana", ana.nome());
        assertEquals(0, dados.stream().filter(d -> d.chave().equals("99999999999"))
                .findFirst().orElseThrow().quantidadeViagens());
        assertNull(dados.stream().filter(d -> d.chave().equals("11111111111"))
                .findFirst().orElseThrow().motoristaId());
        assertEquals(2, dados.stream().filter(d -> d.chave().equals("SEM_IDENTIFICACAO"))
                .findFirst().orElseThrow().quantidadeViagens());
    }

    @Test void consultaNovoPeriodoSemReaproveitarContagem() {
        assertEquals(5, repository.consultar(PeriodoConsulta.parse("01/09/2026", "10/09/2026"))
                .stream().mapToLong(d -> d.quantidadeViagens()).sum());
        var vazio = repository.consultar(PeriodoConsulta.parse("01/10/2026", "31/10/2026"));
        assertEquals(2, vazio.size());
        assertTrue(vazio.stream().allMatch(d -> d.quantidadeViagens() == 0));
    }
}
