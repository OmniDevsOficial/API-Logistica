package com.ominidevs.operacional.veiculo.specifications;

import java.util.Locale;

import org.springframework.data.jpa.domain.Specification;

import com.ominidevs.operacional.indicadores.model.PeriodoConsulta;
import com.ominidevs.operacional.motorista.entities.Motorista;
import com.ominidevs.operacional.veiculo.entities.Veiculo;
import com.ominidevs.operacional.veiculo.model.Placa;
import com.ominidevs.operacional.veiculo.repositories.ResumoFrotaRepository;
import com.ominidevs.operacional.viagem.entities.Viagem;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;

/**
 * Um filtro de GET /veiculos por método, no mesmo padrão de
 * {@code ViagemSpecifications}: parâmetro ausente devolve
 * {@code cb.conjunction()}, então os filtros se compõem com {@code .and()}.
 */
public final class VeiculoSpecifications {

    private VeiculoSpecifications() {
    }

    /** Placa contém o trecho informado, em qualquer formato ("abc-1" acha "ABC1D23"). */
    public static Specification<Veiculo> placaContem(String placa) {
        String trecho = Placa.normalizar(placa);
        if (trecho == null) {
            return (root, query, cb) -> cb.conjunction();
        }
        return (root, query, cb) -> cb.like(root.get("placa"), "%" + trecho + "%");
    }

    /** Tipo igual ao informado, sem diferença de caixa ("Fiorino" acha "FIORINO"). */
    public static Specification<Veiculo> tipoIgual(String tipo) {
        if (tipo == null || tipo.isBlank()) {
            return (root, query, cb) -> cb.conjunction();
        }
        String normalizado = tipo.strip().replaceAll("\\s+", " ").toUpperCase(Locale.ROOT);
        return (root, query, cb) -> cb.equal(root.get("tipo"), normalizado);
    }

    public static Specification<Veiculo> tipoDaFrota(String tipo) {
        if (tipo != null && ResumoFrotaRepository.NAO_IDENTIFICADO.equalsIgnoreCase(tipo.strip())) {
            return (root, query, cb) -> cb.or(cb.isNull(root.get("tipo")), cb.equal(cb.trim(root.get("tipo")), ""));
        }
        return tipoIgual(tipo);
    }

    public static Specification<Veiculo> placaOuMotoristaContem(String busca) {
        if (busca == null || busca.isBlank()) {
            return (root, query, cb) -> cb.conjunction();
        }
        String nome = "%" + escaparLike(busca.strip().replaceAll("\\s+", " ").toUpperCase(Locale.ROOT)) + "%";
        String placa = Placa.normalizar(busca);
        return (root, query, cb) -> {
            Join<Veiculo, Motorista> motorista = root.join("motorista", JoinType.LEFT);
            var nomeContem = cb.like(cb.upper(motorista.get("nome")), nome, '\\');
            if (placa == null) {
                return nomeContem;
            }
            return cb.or(cb.like(root.get("placa"), "%" + escaparLike(placa) + "%", '\\'), nomeContem);
        };
    }

    public static Specification<Veiculo> comViagemNoPeriodo(PeriodoConsulta periodo) {
        if (periodo == null) {
            return (root, query, cb) -> cb.conjunction();
        }
        return (root, query, cb) -> {
            var viagens = query.subquery(Integer.class);
            var viagem = viagens.from(Viagem.class);
            Expression<String> placaDaViagem = cb.upper(cb.function("regexp_replace", String.class,
                    viagem.get("veiculo"), cb.literal("[[:space:]-]"), cb.literal(""), cb.literal("g")));
            viagens.select(cb.literal(1)).where(
                    cb.equal(placaDaViagem, root.get("placa")),
                    cb.between(viagem.get("data"), periodo.inicio(), periodo.fim()));
            return cb.exists(viagens);
        };
    }

    private static String escaparLike(String valor) {
        return valor.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
    }

    public static Specification<Veiculo> doMotorista(Integer motoristaId) {
        if (motoristaId == null) {
            return (root, query, cb) -> cb.conjunction();
        }
        return (root, query, cb) -> cb.equal(root.get("motorista").get("id"), motoristaId);
    }

    public static Specification<Veiculo> ativo(Boolean ativo) {
        if (ativo == null) {
            return (root, query, cb) -> cb.conjunction();
        }
        return (root, query, cb) -> cb.equal(root.get("ativo"), ativo);
    }
}
