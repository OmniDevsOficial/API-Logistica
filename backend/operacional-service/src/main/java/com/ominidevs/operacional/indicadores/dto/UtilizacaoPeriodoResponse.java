package com.ominidevs.operacional.indicadores.dto;

import java.util.List;

public record UtilizacaoPeriodoResponse(
        String dataInicio, String dataFim, String tipoIndicador, String ordenacao,
        long totalViagens, String status, List<UtilizacaoMotoristaResponse> motoristas) {}
