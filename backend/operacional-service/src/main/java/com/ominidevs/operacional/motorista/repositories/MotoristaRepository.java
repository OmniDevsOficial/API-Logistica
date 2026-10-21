package com.ominidevs.operacional.motorista.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ominidevs.operacional.motorista.entities.Motorista;
import com.ominidevs.operacional.motorista.projections.MotoristaStatusContagem;

public interface MotoristaRepository extends JpaRepository<Motorista, Integer> {

    @Query("""
            SELECT new com.ominidevs.operacional.motorista.projections.MotoristaStatusContagem(
                    m.status, COUNT(m))
            FROM Motorista m
            GROUP BY m.status
            """)
    List<MotoristaStatusContagem> contarPorStatus();

    @Query(value = """
            SELECT * FROM operacional.motorista
            WHERE regexp_replace(COALESCE(cpf, ''), '[^0-9]', '', 'g') = :cpf
            """, nativeQuery = true)
    List<Motorista> buscarPorCpf(@Param("cpf") String cpf);

    @Query(value = """
            SELECT * FROM operacional.motorista
            WHERE regexp_replace(COALESCE(cpf, ''), '[^0-9]', '', 'g') = ''
              AND LOWER(TRIM(nome)) = :nome
            """, nativeQuery = true)
    List<Motorista> buscarSemCpfPorNome(@Param("nome") String nome);
}
