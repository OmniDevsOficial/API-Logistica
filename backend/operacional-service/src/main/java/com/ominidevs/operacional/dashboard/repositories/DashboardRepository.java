package com.ominidevs.operacional.dashboard.repositories;

import java.sql.Date;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ominidevs.operacional.dashboard.model.AgrupamentoSerie;
import com.ominidevs.operacional.dashboard.projections.DestinoRentavel;
import com.ominidevs.operacional.dashboard.projections.PontoRentabilidade;
import com.ominidevs.operacional.dashboard.projections.PontoSerie;
import com.ominidevs.operacional.dashboard.projections.ResumoViagens;
import com.ominidevs.operacional.dashboard.projections.ValoresFinanceirosViagem;
import com.ominidevs.operacional.indicadores.model.PeriodoConsulta;

@Repository
public class DashboardRepository {

    private static final String SQL_RESUMO = """
            SELECT COUNT(*) AS total_viagens,
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

    private static final String SQL_SERIE_RENTABILIDADE = """
            SELECT to_char(p.inicio, '%2$s') AS rotulo,
                   COUNT(v.data) AS viagens,
                   COALESCE(SUM(COALESCE(v.custo_frete, 0) + COALESCE(v.pedagio, 0)), 0) AS custo,
                   COALESCE(SUM(COALESCE(v.receita_frete, 0) - COALESCE(v.custo_frete, 0) - COALESCE(v.pedagio, 0)), 0) AS rentabilidade
            FROM generate_series(date_trunc('%1$s', CAST(? AS date)), CAST(? AS date), INTERVAL '1 %1$s') AS p(inicio)
            LEFT JOIN operacional.viagem v
                   ON v.data >= p.inicio AND v.data < p.inicio + INTERVAL '1 %1$s'
                  AND v.data BETWEEN ? AND ?
            GROUP BY p.inicio
            ORDER BY p.inicio
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

    private static final String SQL_DESTINO_MAIS_RENTAVEL = """
            SELECT MIN(TRIM(cidade_destino)) AS destino,
                   COUNT(*) AS viagens,
                   SUM(COALESCE(receita_frete, 0) - COALESCE(custo_frete, 0) - COALESCE(pedagio, 0)) AS rentabilidade_total
            FROM operacional.viagem
            WHERE data BETWEEN ? AND ?
              AND NULLIF(TRIM(cidade_destino), '') IS NOT NULL
            GROUP BY UPPER(TRIM(cidade_destino))
            HAVING COUNT(receita_frete) + COUNT(custo_frete) + COUNT(pedagio) > 0
            ORDER BY rentabilidade_total DESC, viagens DESC, UPPER(TRIM(cidade_destino))
            LIMIT 1
            """;

    private final JdbcTemplate jdbc;

    public DashboardRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public ResumoViagens consultarResumo(PeriodoConsulta periodo) {
        return jdbc.queryForObject(SQL_RESUMO,
                (rs, row) -> new ResumoViagens(
                        rs.getLong("total_viagens"),
                        rs.getObject("km_total", Long.class),
                        rs.getLong("motoristas_ativos"),
                        rs.getLong("veiculos_utilizados"),
                        rs.getLong("viagens_pendentes"),
                        rs.getLong("viagens_em_transito"),
                        rs.getLong("viagens_finalizadas")),
                Date.valueOf(periodo.inicio()), Date.valueOf(periodo.fim()));
    }

    public List<PontoRentabilidade> consultarSerieRentabilidade(PeriodoConsulta periodo, AgrupamentoSerie agrupamento) {
        Date inicio = Date.valueOf(periodo.inicio());
        Date fim = Date.valueOf(periodo.fim());
        return jdbc.query(SQL_SERIE_RENTABILIDADE.formatted(agrupamento.unidadeSql(), agrupamento.formatoRotulo()),
                (rs, row) -> new PontoRentabilidade(
                        rs.getString("rotulo"), rs.getLong("viagens"), rs.getBigDecimal("custo"),
                        rs.getBigDecimal("rentabilidade")),
                inicio, fim, inicio, fim);
    }

    public List<PontoSerie> consultarSeriePorVeiculo(PeriodoConsulta periodo) {
        return jdbc.query(SQL_SERIE_POR_VEICULO, pontoSerie(),
                Date.valueOf(periodo.inicio()), Date.valueOf(periodo.fim()));
    }

    public List<ValoresFinanceirosViagem> consultarValoresFinanceiros(PeriodoConsulta periodo) {
        return jdbc.query("""
                SELECT receita_frete, custo_frete, pedagio
                FROM operacional.viagem
                WHERE data BETWEEN ? AND ?
                """, (rs, row) -> new ValoresFinanceirosViagem(
                    rs.getBigDecimal("receita_frete"), rs.getBigDecimal("custo_frete"), rs.getBigDecimal("pedagio")),
                Date.valueOf(periodo.inicio()), Date.valueOf(periodo.fim()));
    }

    public DestinoRentavel consultarDestinoMaisRentavel(PeriodoConsulta periodo) {
        return jdbc.query(SQL_DESTINO_MAIS_RENTAVEL,
                (rs, row) -> new DestinoRentavel(
                        rs.getString("destino"), rs.getLong("viagens"), rs.getBigDecimal("rentabilidade_total")),
                Date.valueOf(periodo.inicio()), Date.valueOf(periodo.fim()))
                .stream().findFirst().orElse(null);
    }

    private org.springframework.jdbc.core.RowMapper<PontoSerie> pontoSerie() {
        return (rs, row) -> new PontoSerie(
                rs.getString("rotulo"), rs.getLong("viagens"), rs.getBigDecimal("frete_total"));
    }
}
