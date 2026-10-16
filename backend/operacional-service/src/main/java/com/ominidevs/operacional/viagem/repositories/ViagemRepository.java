package com.ominidevs.operacional.viagem.repositories;

import com.ominidevs.operacional.viagem.entities.Viagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.Collection;
import java.util.List;

public interface ViagemRepository extends JpaRepository<Viagem, Integer>, JpaSpecificationExecutor<Viagem> {
    List<Viagem> findByManifestoIn(Collection<String> manifestos);
    java.util.Optional<Viagem> findByManifesto(String manifesto);
}
