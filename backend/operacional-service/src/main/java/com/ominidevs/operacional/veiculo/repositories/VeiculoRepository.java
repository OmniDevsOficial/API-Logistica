package com.ominidevs.operacional.veiculo.repositories;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ominidevs.operacional.veiculo.entities.Veiculo;
import com.ominidevs.operacional.veiculo.projections.VeiculoDoMotorista;

public interface VeiculoRepository extends JpaRepository<Veiculo, Integer>, JpaSpecificationExecutor<Veiculo> {

    List<Veiculo> findByPlacaIn(Collection<String> placas);

    /** Carrega o motorista junto, evitando uma consulta por veículo. */
    @EntityGraph(attributePaths = "motorista")
    Optional<Veiculo> findByPlaca(String placa);

    /** Carrega o motorista junto, evitando uma consulta por veículo. */
    @Override
    @EntityGraph(attributePaths = "motorista")
    List<Veiculo> findAll(Specification<Veiculo> spec, Sort sort);

    @Query("SELECT DISTINCT v.tipo FROM Veiculo v WHERE v.tipo IS NOT NULL ORDER BY v.tipo")
    List<String> listarTipos();

    /**
     * Veículos dos motoristas informados, ativos primeiro (o primeiro de cada
     * motorista é o veículo principal exibido na tela).
     */
    @Query("""
            SELECT new com.ominidevs.operacional.veiculo.projections.VeiculoDoMotorista(
                    v.motorista.id, v.placa, v.tipo, v.modelo, v.ativo)
            FROM Veiculo v
            WHERE v.motorista.id IN :motoristaIds
            ORDER BY v.motorista.id, CASE WHEN v.ativo = false THEN 1 ELSE 0 END, v.id
            """)
    List<VeiculoDoMotorista> listarPorMotoristas(@Param("motoristaIds") Collection<Integer> motoristaIds);
}
