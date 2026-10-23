package com.ominidevs.operacional.viagem.repositories;

import java.time.LocalDate;
import java.util.List;

import com.ominidevs.operacional.viagem.dto.RankingDestinoResponse;
import com.ominidevs.operacional.viagem.dto.RentabilidadeMotoristaResponse;

/**
 * Fragmento do {@link ViagemRepository} para agregações em SQL nativo.
 */
public interface RankingDestinoRepository {

    List<RankingDestinoResponse> rankingDestinosPorRentabilidade(LocalDate inicio, LocalDate fim);

    List<RentabilidadeMotoristaResponse> rentabilidadeMediaPorMotorista(LocalDate inicio, LocalDate fim);
}
