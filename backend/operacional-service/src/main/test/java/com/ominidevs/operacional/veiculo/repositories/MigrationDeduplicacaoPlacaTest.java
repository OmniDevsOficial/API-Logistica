package com.ominidevs.operacional.veiculo.repositories;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;

/**
 * Valida a V10 sobre dados que existiam antes dela: placas iguais em formatos
 * diferentes viram uma só, mantendo o registro mais recente. Docker obrigatório.
 */
class MigrationDeduplicacaoPlacaTest {

    private static final String URL = "jdbc:tc:postgresql:17-alpine:///dedup_placa?TC_DAEMON=true";

    private static Flyway flyway(String alvo) {
        return Flyway.configure()
                .dataSource(URL, "test", "test")
                .schemas("operacional")
                .createSchemas(true)
                .target(alvo)
                .load();
    }

    @Test
    void deduplicaENormalizaPlacasAntesDeCriarIndiceUnico() throws SQLException {
        flyway("9").migrate();
        try (Connection conexao = DriverManager.getConnection(URL, "test", "test");
                Statement sql = conexao.createStatement()) {
            sql.execute("""
                    INSERT INTO operacional.motorista (nome, data_criacao) VALUES ('Ana', CURRENT_DATE);
                    INSERT INTO operacional.veiculo (placa, marca, modelo, motorista_id) VALUES
                    ('abc1234', 'Fiat', 'Uno', 1),
                    ('ABC-123', 'Fiat', 'Uno', 1),
                    ('ABC 123', 'VW', 'Gol', 1),
                    ('XYZ9A87', 'Volvo', 'FH', 1);
                    """);

            flyway("latest").migrate();

            List<String> placas = new ArrayList<>();
            try (ResultSet rs = sql.executeQuery(
                    "SELECT placa || ':' || marca FROM operacional.veiculo ORDER BY placa")) {
                while (rs.next()) {
                    placas.add(rs.getString(1));
                }
            }
            assertEquals(List.of("ABC123:VW", "ABC1234:Fiat", "XYZ9A87:Volvo"), placas);

            sql.execute("INSERT INTO operacional.veiculo (placa) VALUES ('QWE1R23')");
            assertThrows(SQLException.class,
                    () -> sql.execute("INSERT INTO operacional.veiculo (placa) VALUES ('QWE1R23')"));
        }
    }
}
