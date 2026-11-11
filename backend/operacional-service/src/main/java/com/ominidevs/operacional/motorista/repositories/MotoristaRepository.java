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

    /**
     * Busca motoristas sem CPF cujo nome, ignorando caixa, acentos e espaços
     * repetidos, seja igual à chave informada. Usado para ligar o CPF do
     * manifesto a um motorista criado antes pela importação de veículos.
     *
     * @param chave nome gerado por {@code NomeMotorista.chave}.
     * @return motoristas sem CPF com o mesmo nome.
     */
    @Query(value = """
            SELECT * FROM operacional.motorista
            WHERE regexp_replace(COALESCE(cpf, ''), '[^0-9]', '', 'g') = ''
              AND LOWER(TRANSLATE(
                      BTRIM(regexp_replace(COALESCE(nome, ''), '[[:space:]]+', ' ', 'g')),
                      'ÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑáàâãäéèêëíìîïóòôõöúùûüçñ',
                      'AAAAAEEEEIIIIOOOOOUUUUCNaaaaaeeeeiiiiooooouuuucn')) = :chave
            """, nativeQuery = true)
    List<Motorista> buscarSemCpfPorChaveNome(@Param("chave") String chave);
}
