package com.ominidevs.operacional.viagem.specifications;

import com.ominidevs.operacional.viagem.entities.StatusViagem;
import com.ominidevs.operacional.viagem.entities.Viagem;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Um filtro de GET /viagens por método. Cada método é independente e
 * retorna sempre uma Specification válida (nunca null) — quando o
 * parâmetro não foi informado, devolve cb.conjunction() (não filtra nada).
 * Isso permite compor todos os filtros com .and() sem tratamento especial
 * de nulos no service, e permite adicionar um filtro novo sem alterar
 * os existentes.
 */
public final class ViagemSpecifications {

    private ViagemSpecifications() {
    }

    public static Specification<Viagem> destinoContem(String destino) {
        if (destino == null || destino.isBlank()) {
            return (root, query, cb) -> cb.conjunction();
        }
        String termo = "%" + destino.trim().toLowerCase() + "%";
        return (root, query, cb) -> cb.like(cb.lower(root.get("cidadeDestino")), termo);
    }

    public static Specification<Viagem> statusEntre(List<StatusViagem> status) {
        if (status == null || status.isEmpty()) {
            return (root, query, cb) -> cb.conjunction();
        }
        return (root, query, cb) -> root.get("status").in(status);
    }

    public static Specification<Viagem> freteMinimo(BigDecimal freteMin) {
        if (freteMin == null) {
            return (root, query, cb) -> cb.conjunction();
        }
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("valorFrete"), freteMin);
    }

    public static Specification<Viagem> freteMaximo(BigDecimal freteMax) {
        if (freteMax == null) {
            return (root, query, cb) -> cb.conjunction();
        }
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("valorFrete"), freteMax);
    }

    public static Specification<Viagem> dataNoMes(LocalDate inicioMes, LocalDate fimMes) {
        if (inicioMes == null || fimMes == null) {
            return (root, query, cb) -> cb.conjunction();
        }
        return (root, query, cb) -> cb.between(root.get("data"), inicioMes, fimMes);
    }
}
