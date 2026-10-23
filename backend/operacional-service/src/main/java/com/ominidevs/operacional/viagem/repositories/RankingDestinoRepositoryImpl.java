package com.ominidevs.operacional.viagem.repositories;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;

import com.ominidevs.operacional.viagem.dto.RankingDestinoResponse;
import com.ominidevs.operacional.viagem.dto.RentabilidadeMotoristaResponse;
import com.ominidevs.operacional.viagem.services.RentabilidadeService;

public class RankingDestinoRepositoryImpl implements RankingDestinoRepository {

    // Considera todos os status. Viagens sem destino ou com valor financeiro nulo
    // ficam fora, então COUNT(*) conta apenas as viagens que entram na média.
    // A rota (origem + destino) agrupa ignorando caixa e espaços; a ordenação usa
    // a média já arredondada para que empates visíveis caiam nos desempates.
    private static final String SQL_RANKING = """
            SELECT MIN(TRIM(cidade_origem)) AS origem,
                   MIN(TRIM(cidade_destino)) AS destino,
                   COUNT(*) AS quantidade_viagens,
                   ROUND(AVG(%s), 2) AS rentabilidade_media
            FROM operacional.viagem
            WHERE data BETWEEN ? AND ?
              AND NULLIF(TRIM(cidade_destino), '') IS NOT NULL
              AND receita_frete IS NOT NULL
              AND custo_frete IS NOT NULL
              AND pedagio IS NOT NULL
            GROUP BY UPPER(TRIM(cidade_origem)), UPPER(TRIM(cidade_destino))
            ORDER BY rentabilidade_media DESC, quantidade_viagens DESC,
                     UPPER(TRIM(cidade_destino)), UPPER(TRIM(cidade_origem))
            LIMIT 10
            """.formatted(RentabilidadeService.EXPRESSAO_SQL);

    private static final String SQL_RENTABILIDADE_MOTORISTA = """
            SELECT MIN(TRIM(motorista)) AS motorista,
                   COUNT(*) FILTER (WHERE receita_frete IS NOT NULL
                                      AND custo_frete IS NOT NULL
                                      AND pedagio IS NOT NULL) AS quantidade_viagens,
                   ROUND(AVG(%s), 2) AS rentabilidade_media
            FROM operacional.viagem
            WHERE data BETWEEN ? AND ?
              AND NULLIF(TRIM(motorista), '') IS NOT NULL
            GROUP BY UPPER(TRIM(motorista))
            ORDER BY UPPER(TRIM(motorista))
            """.formatted(RentabilidadeService.EXPRESSAO_SQL);

    private final JdbcTemplate jdbc;

    public RankingDestinoRepositoryImpl(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public List<RankingDestinoResponse> rankingDestinosPorRentabilidade(LocalDate inicio, LocalDate fim) {
        return jdbc.query(SQL_RANKING,
                (rs, row) -> new RankingDestinoResponse(
                        rs.getString("origem"),
                        rs.getString("destino"),
                        rs.getLong("quantidade_viagens"),
                        rs.getBigDecimal("rentabilidade_media")),
                Date.valueOf(inicio), Date.valueOf(fim));
    }

    @Override
    public List<RentabilidadeMotoristaResponse> rentabilidadeMediaPorMotorista(LocalDate inicio, LocalDate fim) {
        return jdbc.query(SQL_RENTABILIDADE_MOTORISTA,
                (rs, row) -> new RentabilidadeMotoristaResponse(
                        rs.getString("motorista"),
                        rs.getBigDecimal("rentabilidade_media"),
                        rs.getLong("quantidade_viagens")),
                Date.valueOf(inicio), Date.valueOf(fim));
    }
}
