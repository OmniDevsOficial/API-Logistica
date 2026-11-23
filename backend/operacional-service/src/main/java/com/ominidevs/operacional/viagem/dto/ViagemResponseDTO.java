package com.ominidevs.operacional.viagem.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ViagemResponseDTO(
        Integer id,
        String manifesto,
        LocalDate data,
        String origem,
        String destino,
        BigDecimal freteEstimado,
        String veiculo,
        Integer distanciaKm,
        Integer estimativaDias,
        String status,
        BigDecimal receita,
        BigDecimal custo,
        BigDecimal rentabilidade
) {}