package com.ominidevs.operacional.motorista.dto;

import java.util.List;

/** Resposta do endpoint de ranking, incluindo os tipos de veículo disponíveis no período. */
public record RankingMotoristasResultado(
        List<RankingMotoristaResponse> ranking,
        List<String> tiposDisponiveis) {}
