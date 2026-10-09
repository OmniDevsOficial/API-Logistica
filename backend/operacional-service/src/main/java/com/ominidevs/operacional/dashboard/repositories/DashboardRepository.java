package com.ominidevs.operacional.dashboard.repositories;

import java.sql.Date;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ominidevs.operacional.dashboard.projections.PontoSerie;
import com.ominidevs.operacional.dashboard.projections.ResumoViagens;
import com.ominidevs.operacional.indicadores.model.PeriodoConsulta;

@Repository
public class DashboardRepository {

    private static final String SQL_RESUMO = """
            SELECT COUNT(*) AS total_viagens,
                   SUM(valor_frete) AS frete_total,
                   AVG(valor_frete) AS frete_medio,
                   SUM(CASE WHEN km_saida IS NOT NULL AND km_chegada IS NOT NULL
                            THEN km_chegada - km_saida END) AS km_total,
                   COUNT(DISTINCT NULLIF(regexp_replace(cpf_motorista, '[^0-9]', '', 'g'), '')) AS motoristas_ativos,
                   COUNT(DISTINCT NULLIF(TRIM(veiculo), '')) AS veiculos_utilizados,
                   COUNT(*) FILTER (WHERE status = 'PENDENTE') AS viagens_pendentes,
                   COUNT(*) FILTER (WHERE status = 'EM_TRANSITO') AS viagens_em_transito,
                   COUNT(*) FILTER (WHERE status = 'FINALIZADO') AS viagens_finalizadas
            FROM operacional.viagem
            WHERE data BETWEEN ? AND ?
            """;

    private static final String SQL_SERIE_MENSAL = """
            SELECT to_char(date_trunc('month', data), 'MM/YYYY') AS rotulo,
                   COUNT(*) AS viagens,
                   SUM(valor_frete) AS frete_total
            FROM operacional.viagem
            WHERE data BETWEEN ? AND ?
            GROUP BY date_trunc('month', data)
            ORDER BY date_trunc('month', data)
            """;

    private static final String SQL_SERIE_POR_VEICULO = """
            SELECT COALESCE(NULLIF(TRIM(veiculo), ''), 'SEM_VEICULO') AS rotulo,
                   COUNT(*) AS viagens,
                   SUM(valor_frete) AS frete_total
            FROM operacional.viagem
            WHERE data BETWEEN ? AND ?
            GROUP BY COALESCE(NULLIF(TRIM(veiculo), ''), 'SEM_VEICULO')
            ORDER BY COUNT(*) DESC, 1
            """;

    private final JdbcTemplate jdbc;

    public DashboardRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public ResumoViagens consultarResumo(PeriodoConsulta periodo) {
        return jdbc.queryForObject(SQL_RESUMO,
                (rs, row) -> new ResumoViagens(
                        rs.getLong("total_viagens"),
                        rs.getBigDecimal("frete_total"),
                        rs.getBigDecimal("frete_medio"),
                        rs.getObject("km_total", Long.class),
                        rs.getLong("motoristas_ativos"),
                        rs.getLong("veiculos_utilizados"),
                        rs.getLong("viagens_pendentes"),
                        rs.getLong("viagens_em_transito"),
                        rs.getLong("viagens_finalizadas")),
                Date.valueOf(periodo.inicio()), Date.valueOf(periodo.fim()));
    }

    public List<PontoSerie> consultarSerieMensal(PeriodoConsulta periodo) {
        return jdbc.query(SQL_SERIE_MENSAL, pontoSerie(),
                Date.valueOf(periodo.inicio()), Date.valueOf(periodo.fim()));
    }

    public List<PontoSerie> consultarSeriePorVeiculo(PeriodoConsulta periodo) {
        return jdbc.query(SQL_SERIE_POR_VEICULO, pontoSerie(),
                Date.valueOf(periodo.inicio()), Date.valueOf(periodo.fim()));
    }

    private org.springframework.jdbc.core.RowMapper<PontoSerie> pontoSerie() {
        return (rs, row) -> new PontoSerie(
                rs.getString("rotulo"), rs.getLong("viagens"), rs.getBigDecimal("frete_total"));
    }
}
