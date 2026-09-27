package com.ominidevs.operacional.indicadores.repositories;

import java.sql.Date;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import com.ominidevs.operacional.indicadores.model.PeriodoConsulta;
import com.ominidevs.operacional.indicadores.projections.MotoristaQuantidadeViagens;

@Repository
public class UtilizacaoRepository {
    private final JdbcTemplate jdbc;

    public UtilizacaoRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    public List<MotoristaQuantidadeViagens> consultar(PeriodoConsulta periodo) {
        // Uma consulta mantém contagem e total no mesmo retrato do banco.
        // Não filtra status nem deduplica manifesto: cada linha é uma viagem.
        // CPF continua texto, preservando zeros iniciais; nomes não são identidade.
        return jdbc.query("""
                WITH cadastro AS (
                    SELECT NULLIF(regexp_replace(cpf, '[^0-9]', '', 'g'), '') AS cpf,
                           MIN(id) AS id, MIN(nome) AS nome
                    FROM operacional.motorista
                    GROUP BY NULLIF(regexp_replace(cpf, '[^0-9]', '', 'g'), '')
                ), viagens AS (
                    SELECT NULLIF(regexp_replace(cpf_motorista, '[^0-9]', '', 'g'), '') AS cpf,
                           MIN(NULLIF(TRIM(motorista), '')) AS nome, COUNT(*) AS quantidade
                    FROM operacional.viagem
                    WHERE data BETWEEN ? AND ?
                    GROUP BY NULLIF(regexp_replace(cpf_motorista, '[^0-9]', '', 'g'), '')
                )
                SELECT COALESCE(c.cpf, v.cpf, 'SEM_IDENTIFICACAO') AS chave,
                       c.id AS motorista_id,
                       CASE WHEN COALESCE(c.cpf, v.cpf) IS NULL
                            THEN 'Sem motorista identificado'
                            ELSE COALESCE(NULLIF(TRIM(c.nome), ''), v.nome, 'Motorista sem nome')
                       END AS nome,
                       COALESCE(v.quantidade, 0) AS quantidade
                FROM cadastro c FULL OUTER JOIN viagens v ON c.cpf = v.cpf
                """,
                (rs, row) -> new MotoristaQuantidadeViagens(
                        rs.getString("chave"), rs.getObject("motorista_id", Integer.class),
                        rs.getString("nome"), rs.getLong("quantidade")),
                Date.valueOf(periodo.inicio()), Date.valueOf(periodo.fim()));
    }
}
