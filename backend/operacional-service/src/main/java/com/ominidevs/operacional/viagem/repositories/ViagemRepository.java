package com.ominidevs.operacional.viagem.repositories;

import com.ominidevs.operacional.indicadores.dto.ViagensPorMotoristaDTO;
import com.ominidevs.operacional.viagem.entities.Viagem;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ViagemRepository extends JpaRepository<Viagem, Integer>, JpaSpecificationExecutor<Viagem> {

    @Query("""
            SELECT new com.ominidevs.operacional.indicadores.dto.ViagensPorMotoristaDTO(
                       v.cpf_motorista,
                       MIN(v.motorista),
                       SUM(CASE WHEN v.data BETWEEN :inicio AND :fim THEN 1L ELSE 0L END))
            FROM Viagem v
            GROUP BY v.cpf_motorista
            ORDER BY MIN(v.motorista)
            """)
    List<ViagensPorMotoristaDTO> contarViagensPorMotorista(
            @Param("inicio") LocalDate inicio,
            @Param("fim") LocalDate fim
    );

    @Query("""
            SELECT v
            FROM Viagem v
            WHERE v.cpf_motorista = :cpf
              AND v.data BETWEEN :inicio AND :fim
            ORDER BY v.data
            """)
    List<Viagem> buscarPorMotoristaNoPeriodo(
            @Param("cpf") String cpf,
            @Param("inicio") LocalDate inicio,
            @Param("fim") LocalDate fim
    );
}
