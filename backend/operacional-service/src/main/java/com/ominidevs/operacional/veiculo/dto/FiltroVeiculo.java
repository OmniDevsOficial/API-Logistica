package com.ominidevs.operacional.veiculo.dto;

/**
 * Filtros opcionais de GET /veiculos; {@code null} não filtra.
 *
 * @param placa trecho da placa, em qualquer formato.
 * @param tipo tipo exato, sem diferença de caixa.
 * @param motoristaId motorista atual.
 * @param ativo situação na frota.
 */
public record FiltroVeiculo(String placa, String tipo, Integer motoristaId, Boolean ativo) {

    /** Sem filtros: todos os veículos. */
    public static FiltroVeiculo todos() {
        return new FiltroVeiculo(null, null, null, null);
    }
}
