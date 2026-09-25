package com.ominidevs.operacional.viagem.dto;

import java.math.BigDecimal;

public record ViagemResponseDTO(
        Integer id,
        String origem,
        String destino,
        BigDecimal freteEstimado,
        String veiculo,
        Integer distanciaKm,
        Integer estimativaDias,
        String status
) {}