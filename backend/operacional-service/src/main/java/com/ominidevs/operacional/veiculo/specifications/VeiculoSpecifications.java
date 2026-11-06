package com.ominidevs.operacional.veiculo.specifications;

import java.util.Locale;

import org.springframework.data.jpa.domain.Specification;

import com.ominidevs.operacional.veiculo.entities.Veiculo;
import com.ominidevs.operacional.veiculo.model.Placa;

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
