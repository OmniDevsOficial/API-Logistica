package com.ominidevs.operacional.veiculo.dto;

/**
 * Veículo resumido, como aparece dentro de outras respostas (ex.: lista de
 * motoristas).
 *
 * @param placa placa normalizada.
 * @param tipo tipo em maiúsculas.
 * @param modelo modelo (o "nome" do veículo).
 * @param ativo situação na frota; {@code null} quando não informada.
 */
public record VeiculoResumoResponse(String placa, String tipo, String modelo, Boolean ativo) {}
