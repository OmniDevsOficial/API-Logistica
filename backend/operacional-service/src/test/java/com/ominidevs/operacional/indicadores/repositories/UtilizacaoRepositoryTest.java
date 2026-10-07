package com.ominidevs.operacional.indicadores.repositories;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import com.ominidevs.operacional.indicadores.model.PeriodoConsulta;
import static org.junit.jupiter.api.Assertions.*;

/** PostgreSQL descartável com migrations reais. Docker obrigatório; não ignora testes. */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE, properties = {
        "spring.datasource.url=jdbc:tc:postgresql:17-alpine:///indicadores?currentSchema=operacional",
        "spring.datasource.driver-class-name=org.testcontainers.jdbc.ContainerDatabaseDriver",
        "spring.datasource.username=test",
        "spring.datasource.password=test",
        "spring.jpa.hibernate.ddl-auto=validate",
        "spring.jpa.properties.hibernate.default_schema=operacional",
        "spring.flyway.schemas=operacional",
        "spring.flyway.create-schemas=true"
})
@Transactional
class UtilizacaoRepositoryTest {
    @Autowired private JdbcTemplate jdbc;
    @Autowired private UtilizacaoRepository repository;
    private Integer anaId;

    @BeforeEach void preparar() {
        jdbc.execute("""
                INSERT INTO operacional.motorista (nome, cpf, cidade, estado, data_criacao) VALUES
                ('Ana', '00123456789', 'Campinas', 'SP', '2026-01-01'),
                ('Carlos', '99999999999', 'Campinas', 'SP', '2026-01-01');
                INSERT INTO operacional.viagem (manifesto, data, motorista, cpf_motorista, status) VALUES
                ('M1', '2026-09-01', 'ANA', '001.234.567-89', 'PENDENTE'),
                ('M2', '2026-09-01', 'Ana Silva', '00123456789', 'FINALIZADO'),
                ('M3', '2026-09-10', 'Bruno', '11111111111', 'EM_TRANSITO'),
                ('M4', '2026-09-10', 'Sem CPF', NULL, 'PENDENTE'),
                ('M5', '2026-09-10', 'Outro sem CPF', '', 'FINALIZADO'),
                ('M6', '2026-08-31', 'Ana', '00123456789', 'PENDENTE'),
                ('M7', '2026-09-11', 'Bruno', '11111111111', 'PENDENTE')
                """);
        anaId = jdbc.queryForObject("SELECT id FROM operacional.motorista WHERE cpf = ?",
                Integer.class, "00123456789");
    }
    @Test void agrupaPorCpfIncluiLimitesTodosStatusECadastroSemViagens() {
        var dados = repository.consultar(PeriodoConsulta.parse("01/09/2026", "10/09/2026"));
        assertEquals(4, dados.size());
        assertEquals(5, dados.stream().mapToLong(d -> d.quantidadeViagens()).sum());
        var ana = dados.stream().filter(d -> d.chave().equals("00123456789")).findFirst().orElseThrow();
        assertEquals(2, ana.quantidadeViagens());
        assertEquals(anaId, ana.motoristaId());
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
