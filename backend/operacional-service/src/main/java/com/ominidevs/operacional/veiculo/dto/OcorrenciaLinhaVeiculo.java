package com.ominidevs.operacional.veiculo.dto;

/**
 * Problema encontrado em uma linha do CSV de veículos.
 *
 * @param linha número da linha na planilha (o cabeçalho é a linha 1).
 * @param placa placa já normalizada, quando informada.
 * @param mensagem descrição do problema.
 */
public record OcorrenciaLinhaVeiculo(int linha, String placa, String mensagem) {}
