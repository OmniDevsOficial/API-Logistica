package com.ominidevs.operacional.viagem.dto;

import java.math.BigDecimal;

public record ViagemResponseDTO(
        Integer id,
        String manifesto,
        String origem,
        String destino,
        BigDecimal freteEstimado,
        String veiculo,
        Integer distanciaKm,
        Integer estimativaDias,
        String status
) {}