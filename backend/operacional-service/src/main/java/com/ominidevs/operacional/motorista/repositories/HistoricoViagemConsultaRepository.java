package com.ominidevs.operacional.motorista.repositories;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ominidevs.operacional.motorista.projections.ViagemHistoricoLinha;
import com.ominidevs.operacional.viagem.entities.StatusViagem;

@Repository
public class HistoricoViagemConsultaRepository {

    private static final String FILTRO = """
            FROM operacional.viagem v
            WHERE NULLIF(regexp_replace(v.cpf_motorista, '[^0-9]', '', 'g'), '')
                    = NULLIF(regexp_replace(CAST(:cpf AS VARCHAR), '[^0-9]', '', 'g'), '')
               OR (NULLIF(regexp_replace(v.cpf_motorista, '[^0-9]', '', 'g'), '') IS NULL
                   AND LOWER(TRIM(v.motorista)) = LOWER(TRIM(CAST(:nome AS VARCHAR))))
            """;

    private static final String PAGINA = """
            SELECT v.id, v.manifesto, v.cidade_origem, v.cidade_destino, v.data,
                   v.data_previsao_chegada, v.status
            """ + FILTRO + """
            ORDER BY v.data DESC, v.id DESC
            LIMIT :limite OFFSET :deslocamento
            """;

    private static final String CONTAGEM = "SELECT COUNT(*) " + FILTRO;

    private final NamedParameterJdbcTemplate jdbc;

    public HistoricoViagemConsultaRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public long contar(String cpf, String nome) {
        Long total = jdbc.queryForObject(CONTAGEM, vinculo(cpf, nome), Long.class);
        return total == null ? 0 : total;
    }

    public List<ViagemHistoricoLinha> listar(String cpf, String nome, int limite, long deslocamento) {
        Map<String, Object> parametros = vinculo(cpf, nome);
        parametros.put("limite", limite);
        parametros.put("deslocamento", deslocamento);

        return jdbc.query(PAGINA, parametros,
                (rs, row) -> new ViagemHistoricoLinha(
                        rs.getObject("id", Integer.class),
                        rs.getString("manifesto"),
                        rs.getString("cidade_origem"),
                        rs.getString("cidade_destino"),
                        rs.getObject("data", LocalDate.class),
                        rs.getObject("data_previsao_chegada", LocalDate.class),
                        StatusViagem.valueOf(rs.getString("status"))));
    }

    private Map<String, Object> vinculo(String cpf, String nome) {
        Map<String, Object> parametros = new HashMap<>();
        parametros.put("cpf", cpf);
        parametros.put("nome", nome);
        return parametros;
    }
}
