package com.ominidevs.operacional.viagem.repositories;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;

import com.ominidevs.operacional.viagem.dto.RankingDestinoResponse;
import com.ominidevs.operacional.viagem.services.RentabilidadeService;

public class RankingDestinoRepositoryImpl implements RankingDestinoRepository {

    // Considera todos os status. Viagens sem destino ou com valor financeiro nulo
    // ficam fora, então COUNT(*) conta apenas as viagens que entram na média.
    // Destino agrupa ignorando caixa e espaços; a ordenação usa a média já
    // arredondada para que empates visíveis caiam nos critérios de desempate.
    private static final String SQL_RANKING = """
            SELECT MIN(TRIM(cidade_destino)) AS destino,
                   COUNT(*) AS quantidade_viagens,
                   ROUND(AVG(%s), 2) AS rentabilidade_media
            FROM operacional.viagem
            WHERE data BETWEEN ? AND ?
              AND NULLIF(TRIM(cidade_destino), '') IS NOT NULL
              AND receita_frete IS NOT NULL
              AND custo_frete IS NOT NULL
              AND pedagio IS NOT NULL
            GROUP BY UPPER(TRIM(cidade_destino))
            ORDER BY rentabilidade_media DESC, quantidade_viagens DESC, UPPER(TRIM(cidade_destino))
            LIMIT 10
            """.formatted(RentabilidadeService.EXPRESSAO_SQL);

    private final JdbcTemplate jdbc;

    public RankingDestinoRepositoryImpl(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public List<RankingDestinoResponse> rankingDestinosPorRentabilidade(LocalDate inicio, LocalDate fim) {
        return jdbc.query(SQL_RANKING,
                (rs, row) -> new RankingDestinoResponse(
                        rs.getString("destino"),
                        rs.getLong("quantidade_viagens"),
                        rs.getBigDecimal("rentabilidade_media")),
                Date.valueOf(inicio), Date.valueOf(fim));
    }
}
