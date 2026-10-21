package com.ominidevs.operacional.motorista.projections;

import com.ominidevs.operacional.motorista.entities.StatusMotorista;

public record MotoristaStatusContagem(StatusMotorista status, Long quantidade) {}
