package com.ominidevs.operacional.veiculo.dto;

import java.math.BigDecimal;
import java.util.List;

public record ResumoFrotaResponse(
        boolean possuiDados,
        long totalVeiculos,
        long veiculosSemMotorista,
        long motoristasComVeiculo,
        List<QuantidadePorTipo> porTipo,
        List<PercentualPorCombustivel> porCombustivel,
        List<QuantidadePorMarca> porMarca) {

    public record QuantidadePorTipo(String tipo, long quantidade) {}

    public record PercentualPorCombustivel(String combustivel, long quantidade, BigDecimal percentual) {}

    public record QuantidadePorMarca(String marca, long quantidade) {}
}
