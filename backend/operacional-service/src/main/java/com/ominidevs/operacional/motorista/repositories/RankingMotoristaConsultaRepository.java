package com.ominidevs.operacional.motorista.repositories;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ominidevs.operacional.motorista.projections.RankingMotoristaLinha;
import com.ominidevs.operacional.viagem.services.RentabilidadeService;

/**
 * Agregação do ranking mensal de motoristas direto no PostgreSQL.
 *
 * O motorista é identificado pela coluna Motorista do manifesto (mesmo agrupamento
 * da US09: UPPER(TRIM(motorista))). O cadastro é casado pelo CPF normalizado via
 * LATERAL com LIMIT 1, para nunca multiplicar as linhas do grupo. Motoristas sem
 * viagem no período ficam de fora porque a viagem é a linha de partida do GROUP BY.
 */
@Repository
public class RankingMotoristaConsultaRepository {

    // Período semiaberto [inicio, fim): o fim já chega como o dia seguinte ao último.
    // frete/custos/total somam com COALESCE e a expressão de rentabilidade da US09
    // ignora viagens em que receita ou vale frete é nulo (SUM pula NULL).
    // O CPF vem do cadastro quando existe, senão da última viagem do período
    // (é o fallback exibido sob o nome, já que o sistema não tem telefone).
    private static final String CONSULTA = """
            SELECT MIN(TRIM(v.motorista)) AS nome,
                   MIN(m.id) AS motorista_id,
                   COALESCE(MIN(m.cpf),
                            (ARRAY_AGG(v.cpf_motorista ORDER BY v.data DESC, v.id DESC))[1]) AS cpf,
                   COALESCE(MIN(m.veiculo_tipo),
                            (ARRAY_AGG(v.veiculo_tipo ORDER BY v.data DESC, v.id DESC))[1]) AS veiculo,
                   COALESCE(MIN(m.veiculo_placa),
                            (ARRAY_AGG(v.veiculo ORDER BY v.data DESC, v.id DESC))[1]) AS placa,
                   COUNT(*) AS quantidade_viagens,
                   COUNT(DISTINCT v.data) AS dias_com_viagem,
                   COALESCE(SUM(v.receita_frete), 0) AS frete,
                   COALESCE(SUM(v.vale_frete), 0) AS custos,
                   COALESCE(SUM(%s), 0) AS rentabilidade_total
            FROM operacional.viagem v
            LEFT JOIN LATERAL (
                SELECT m.id, m.cpf, m.veiculo_tipo, m.veiculo_placa
                FROM operacional.motorista m
                WHERE NULLIF(regexp_replace(m.cpf, '[^0-9]', '', 'g'), '')
                  = NULLIF(regexp_replace(v.cpf_motorista, '[^0-9]', '', 'g'), '')
                LIMIT 1
            ) m ON true
            WHERE v.data >= ? AND v.data < ?
              AND NULLIF(TRIM(v.motorista), '') IS NOT NULL
            GROUP BY UPPER(TRIM(v.motorista))
            """.formatted(RentabilidadeService.EXPRESSAO_SQL);

    private final JdbcTemplate jdbc;

    public RankingMotoristaConsultaRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    /**
     * @param inicio       primeiro dia do período (incluso)
     * @param fimExclusivo primeiro dia após o período (excluído)
     */
    public List<RankingMotoristaLinha> consultar(LocalDate inicio, LocalDate fimExclusivo) {
        return jdbc.query(CONSULTA,
                (rs, row) -> new RankingMotoristaLinha(
                        rs.getString("nome"),
                        rs.getObject("motorista_id", Integer.class),
                        rs.getString("cpf"),
                        rs.getString("veiculo"),
                        rs.getString("placa"),
                        rs.getLong("quantidade_viagens"),
                        rs.getLong("dias_com_viagem"),
                        rs.getBigDecimal("frete"),
                        rs.getBigDecimal("custos"),
                        rs.getBigDecimal("rentabilidade_total")),
                Date.valueOf(inicio), Date.valueOf(fimExclusivo));
    }
}
