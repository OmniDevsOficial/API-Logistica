package com.ominidevs.operacional.motorista.repositories;

import java.sql.Date;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ominidevs.operacional.indicadores.model.PeriodoConsulta;
import com.ominidevs.operacional.motorista.entities.StatusMotorista;
import com.ominidevs.operacional.motorista.projections.MotoristaListagem;

@Repository
public class MotoristaConsultaRepository {

    private static final String CONSULTA = """
            SELECT m.id, m.nome, m.veiculo_tipo, m.veiculo_placa, m.status,
                   m.ultima_localizacao, m.ultima_operacao, m.previsao_disponibilidade,
                   COALESCE(v.quantidade, 0) AS quantidade
            FROM operacional.motorista m
            LEFT JOIN (
                SELECT NULLIF(regexp_replace(cpf_motorista, '[^0-9]', '', 'g'), '') AS cpf,
                       LOWER(TRIM(motorista)) AS nome,
                       COUNT(*) AS quantidade
                FROM operacional.viagem
                WHERE data BETWEEN :inicio AND :fim
                GROUP BY 1, 2
            ) v ON v.cpf = NULLIF(regexp_replace(m.cpf, '[^0-9]', '', 'g'), '')
                OR (v.cpf IS NULL AND v.nome = LOWER(TRIM(m.nome)))
            WHERE CAST(:status AS VARCHAR) IS NULL OR m.status = :status
            ORDER BY m.nome
            """;

    private final NamedParameterJdbcTemplate jdbc;

    public MotoristaConsultaRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public List<MotoristaListagem> consultar(PeriodoConsulta periodo, StatusMotorista status) {
        Map<String, Object> parametros = new HashMap<>();
        parametros.put("inicio", Date.valueOf(periodo.inicio()));
        parametros.put("fim", Date.valueOf(periodo.fim()));
        parametros.put("status", status == null ? null : status.name());

        return jdbc.query(CONSULTA, parametros,
                (rs, row) -> new MotoristaListagem(
                        rs.getObject("id", Integer.class),
                        rs.getString("nome"),
                        rs.getString("veiculo_tipo"),
                        rs.getString("veiculo_placa"),
                        rs.getString("status"),
                        rs.getString("ultima_localizacao"),
                        rs.getObject("ultima_operacao", LocalDate.class),
                        rs.getObject("previsao_disponibilidade", LocalDate.class),
                        rs.getLong("quantidade")));
    }
}
