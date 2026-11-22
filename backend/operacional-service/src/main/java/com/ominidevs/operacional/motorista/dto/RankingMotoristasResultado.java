package com.ominidevs.operacional.motorista.dto;

import java.util.List;

public record RankingMotoristasResultado(
        List<RankingMotoristaResponse> ranking,
        List<String> tiposDisponiveis) {}
