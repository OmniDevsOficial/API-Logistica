package com.ominidevs.operacional.viagem.repositories;

import com.ominidevs.operacional.viagem.entities.Viagem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ViagemRepository extends JpaRepository<Viagem, Integer> {
}