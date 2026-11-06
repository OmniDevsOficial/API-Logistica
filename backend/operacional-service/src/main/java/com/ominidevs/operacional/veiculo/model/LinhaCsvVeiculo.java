package com.ominidevs.operacional.veiculo.model;

/**
 * Linha do CSV de veículos já normalizada, ainda não validada.
 *
 * @param numero número da linha na planilha (o cabeçalho é a linha 1).
 * @param placa placa em maiúsculas, sem hífen e sem espaço; {@code null} se vazia.
 * @param tipo tipo do veículo em maiúsculas; {@code null} se vazio.
 * @param motorista nome do motorista com espaços normalizados; {@code null} se vazio.
 * @param marca marca como veio na planilha (sem espaços extras); {@code null} se vazia.
 * @param modelo modelo como veio na planilha (sem espaços extras); {@code null} se vazio.
 * @param status texto da coluna "Status do Veículo" (ex.: "Ativo"); {@code null} se vazio.
 */
public record LinhaCsvVeiculo(
        int numero,
        String placa,
        String tipo,
        String motorista,
        String marca,
        String modelo,
        String status) {

    /** Linha só com as colunas obrigatórias e o motorista. */
    public LinhaCsvVeiculo(int numero, String placa, String tipo, String motorista) {
        this(numero, placa, tipo, motorista, null, null, null);
    }
}
