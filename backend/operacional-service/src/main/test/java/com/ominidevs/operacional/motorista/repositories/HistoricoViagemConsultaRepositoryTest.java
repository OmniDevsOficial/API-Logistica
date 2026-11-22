package com.ominidevs.operacional.motorista.repositories;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

import com.ominidevs.operacional.motorista.projections.ViagemHistoricoLinha;
import com.ominidevs.operacional.viagem.entities.StatusViagem;
import com.ominidevs.operacional.viagem.entities.Viagem;
import com.ominidevs.operacional.viagem.repositories.ViagemRepository;

import jakarta.persistence.EntityManager;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE, properties = {
        "spring.datasource.url=jdbc:tc:postgresql:17-alpine:///historico_viagem?currentSchema=operacional",
        "spring.datasource.driver-class-name=org.testcontainers.jdbc.ContainerDatabaseDriver",
        "spring.datasource.username=test",
        "spring.datasource.password=test",
        "spring.jpa.hibernate.ddl-auto=validate",
        "spring.jpa.properties.hibernate.default_schema=operacional",
        "spring.flyway.schemas=operacional",
        "spring.flyway.create-schemas=true"
})
@Transactional
class HistoricoViagemConsultaRepositoryTest {

    @Autowired private HistoricoViagemConsultaRepository repository;
    @Autowired private ViagemRepository viagens;
    @Autowired private EntityManager entityManager;
    @Autowired private JdbcTemplate jdbc;

    private int sequencia;

    private Viagem viagem(String data, String motorista, String cpf, StatusViagem status) {
        Viagem viagem = new Viagem("M-" + (++sequencia), LocalDate.parse(data), motorista, cpf,
                "ABC1D23", "Origem Teste", "Destino Teste", new BigDecimal("1000.00"),
                100, 200, status, null, null);
        viagem.setVeiculoTipo("Truck");
        return viagem;
    }

    private void salvar(Viagem... novas) {
        viagens.saveAll(List.of(novas));
        entityManager.flush();
        entityManager.clear();
    }

    private List<String> manifestos(String cpf, String nome, int limite, long deslocamento) {
        return repository.listar(cpf, nome, limite, deslocamento).stream()
                .map(ViagemHistoricoLinha::manifesto).toList();
    }

    @Test
    void achaAViagemPeloCpfEscritoComPontuacaoDiferente() {
        salvar(viagem("2026-09-01", "Ana Silva", "001.234.567-89", StatusViagem.FINALIZADO),
                viagem("2026-09-02", "Ana Silva", "00123456789", StatusViagem.EM_TRANSITO));

        assertEquals(2, repository.contar("00123456789", "Ana Silva"));
        assertEquals(2, repository.contar("001.234.567-89", "Ana Silva"));
        assertEquals(2, repository.listar("00123456789", "Ana Silva", 10, 0).size());
    }

    @Test
    void incluiAViagemSemCpfCujoNomeBateIgnorandoCaixaEEspacos() {
        salvar(viagem("2026-09-01", "Ana Silva", "00123456789", StatusViagem.FINALIZADO),
                viagem("2026-09-02", "  ANA silva ", "", StatusViagem.PENDENTE));

        assertEquals(2, repository.contar("00123456789", "Ana Silva"));
    }

    @Test
    void motoristaSemCpfCasaSoPeloNome() {
        salvar(viagem("2026-09-01", "Bruno Lima", "", StatusViagem.FINALIZADO),
                viagem("2026-09-02", "Bruno Lima", "99999999999", StatusViagem.FINALIZADO));

        assertEquals(1, repository.contar(null, "Bruno Lima"));
        assertEquals(1, repository.contar("", "bruno lima"));
        assertEquals("M-1", repository.listar(null, "Bruno Lima", 10, 0).getFirst().manifesto());
    }

    @Test
    void ignoraHomonimoComOutroCpf() {
        salvar(viagem("2026-09-01", "Ana Silva", "00123456789", StatusViagem.FINALIZADO),
                viagem("2026-09-02", "Ana Silva", "11111111111", StatusViagem.FINALIZADO));

        assertEquals(1, repository.contar("00123456789", "Ana Silva"));
        assertEquals("M-1", repository.listar("00123456789", "Ana Silva", 10, 0).getFirst().manifesto());
    }

    @Test
    void ordenaPorDataEIdDecrescentes() {
        salvar(viagem("2026-09-01", "Ana Silva", "00123456789", StatusViagem.FINALIZADO),
                viagem("2026-09-05", "Ana Silva", "00123456789", StatusViagem.FINALIZADO),
                viagem("2026-09-05", "Ana Silva", "00123456789", StatusViagem.FINALIZADO),
                viagem("2026-08-20", "Ana Silva", "00123456789", StatusViagem.FINALIZADO));

        assertEquals(List.of("M-3", "M-2", "M-1", "M-4"), manifestos("00123456789", "Ana Silva", 10, 0));
    }

    @Test
    void respeitaLimiteEDeslocamentoEContaOTotal() {
        salvar(viagem("2026-09-01", "Ana Silva", "00123456789", StatusViagem.FINALIZADO),
                viagem("2026-09-02", "Ana Silva", "00123456789", StatusViagem.FINALIZADO),
                viagem("2026-09-03", "Ana Silva", "00123456789", StatusViagem.FINALIZADO),
                viagem("2026-09-04", "Ana Silva", "00123456789", StatusViagem.FINALIZADO),
                viagem("2026-09-05", "Ana Silva", "00123456789", StatusViagem.FINALIZADO));

        assertEquals(5, repository.contar("00123456789", "Ana Silva"));
        assertEquals(List.of("M-5", "M-4"), manifestos("00123456789", "Ana Silva", 2, 0));
        assertEquals(List.of("M-3", "M-2"), manifestos("00123456789", "Ana Silva", 2, 2));
        assertEquals(List.of("M-1"), manifestos("00123456789", "Ana Silva", 2, 4));
    }

    @Test
    void leOsCamposEOStatusDaViagem() {
        Viagem viagem = viagem("2026-10-28", "Ana Silva", "00123456789", StatusViagem.EM_TRANSITO);
        viagem.setDataPrevisaoChegada(LocalDate.of(2026, 10, 30));
        salvar(viagem);

        ViagemHistoricoLinha linha = repository.listar("00123456789", "Ana Silva", 10, 0).getFirst();

        assertEquals("Origem Teste", linha.origem());
        assertEquals("Destino Teste", linha.destino());
        assertEquals(LocalDate.of(2026, 10, 28), linha.dataSaida());
        assertEquals(LocalDate.of(2026, 10, 30), linha.previsaoChegada());
        assertEquals(StatusViagem.EM_TRANSITO, linha.status());
    }

    @Test
    void aMigrationCriouOsDoisIndicesDoHistorico() {
        List<String> indices = jdbc.queryForList(
                "SELECT indexname FROM pg_indexes WHERE schemaname = 'operacional' AND tablename = 'viagem'",
                String.class);

        assertTrue(indices.contains("ix_viagem_historico_cpf"));
        assertTrue(indices.contains("ix_viagem_historico_nome"));
    }
}
