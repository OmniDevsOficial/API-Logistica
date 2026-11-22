package com.ominidevs.operacional.veiculo.repositories;

import java.sql.Date;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.ominidevs.operacional.indicadores.model.PeriodoConsulta;
import com.ominidevs.operacional.veiculo.projections.LinhaResumoFrota;

@Repository
public class ResumoFrotaRepository {

    public static final String NAO_IDENTIFICADO = "NAO_IDENTIFICADO";
    public static final String GRUPO_TOTAL = "TOTAL";
    public static final String GRUPO_TIPO = "TIPO";
    public static final String GRUPO_COMBUSTIVEL = "COMBUSTIVEL";
    public static final String GRUPO_MARCA = "MARCA";

    private static final String SQL_RESUMO = """
            WITH frota AS (
                SELECT COALESCE(NULLIF(TRIM(ve.tipo), ''), '%1$s') AS tipo,
                       COALESCE(NULLIF(UPPER(TRIM(ve.combustivel)), ''), '%1$s') AS combustivel,
                       CASE WHEN ve.motorista_id IS NOT NULL
                            THEN COALESCE(NULLIF(UPPER(TRIM(ve.marca)), ''), '%1$s') END AS marca,
                       ve.motorista_id
                FROM operacional.veiculo ve
                %6$s
            )
            SELECT CASE WHEN GROUPING(tipo) = 0 THEN '%3$s'
                        WHEN GROUPING(combustivel) = 0 THEN '%4$s'
                        WHEN GROUPING(marca) = 0 THEN '%5$s'
                        ELSE '%2$s' END AS grupo,
                   COALESCE(tipo, combustivel, marca) AS chave,
                   COUNT(*) AS quantidade,
                   COUNT(*) FILTER (WHERE motorista_id IS NULL) AS sem_motorista,
                   COUNT(DISTINCT motorista_id) AS motoristas
            FROM frota
            GROUP BY GROUPING SETS ((), (tipo), (combustivel), (marca))
            ORDER BY grupo, quantidade DESC, chave
            """;

    private static final String FILTRO_VIAGEM_NO_PERIODO = """
            WHERE EXISTS (
                    SELECT 1
                    FROM operacional.viagem vi
                    WHERE UPPER(regexp_replace(vi.veiculo, '[[:space:]-]', '', 'g')) = ve.placa
                      AND vi.data BETWEEN ? AND ?
                )""";

    private static final String SQL_FROTA = sql("");
    private static final String SQL_FROTA_NO_PERIODO = sql(FILTRO_VIAGEM_NO_PERIODO);

    private final JdbcTemplate jdbc;

    public ResumoFrotaRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public List<LinhaResumoFrota> consultar(PeriodoConsulta periodo) {
        RowMapper<LinhaResumoFrota> mapeador = (rs, linha) -> new LinhaResumoFrota(
                rs.getString("grupo"),
                rs.getString("chave"),
                rs.getLong("quantidade"),
                rs.getLong("sem_motorista"),
                rs.getLong("motoristas"));
        if (periodo == null) {
            return jdbc.query(SQL_FROTA, mapeador);
        }
        return jdbc.query(SQL_FROTA_NO_PERIODO, mapeador,
                Date.valueOf(periodo.inicio()), Date.valueOf(periodo.fim()));
    }

    private static String sql(String filtro) {
        return SQL_RESUMO.formatted(
                NAO_IDENTIFICADO, GRUPO_TOTAL, GRUPO_TIPO, GRUPO_COMBUSTIVEL, GRUPO_MARCA, filtro);
    }
}
