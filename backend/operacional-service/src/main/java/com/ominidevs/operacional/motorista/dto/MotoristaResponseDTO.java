package com.ominidevs.operacional.motorista.dto;

import java.time.LocalDate;

public record MotoristaResponseDTO(
        Integer id,
        String nome,
        String cpf,
        String tipoVeiculo,
        String placa,
        String status,
        String localizacao,
        LocalDate ultimaOperacao,
        LocalDate previsaoDisponibilidade,
        long quantidadeViagens) {}
