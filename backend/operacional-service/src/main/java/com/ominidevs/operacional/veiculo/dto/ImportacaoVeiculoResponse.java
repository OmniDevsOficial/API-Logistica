package com.ominidevs.operacional.veiculo.dto;

import java.util.List;

/**
 * Resumo da importação do CSV de veículos.
 *
 * @param totalLinhas linhas de dados lidas (sem o cabeçalho e linhas em branco).
 * @param veiculosCadastrados placas que ainda não existiam.
 * @param veiculosAtualizados placas que já existiam e foram atualizadas.
 * @param motoristasCadastrados motoristas criados nesta importação.
 * @param veiculosSemMotorista veículos gravados sem motorista atual.
 * @param linhasComErro quantidade de linhas rejeitadas.
 * @param erros linhas rejeitadas e o motivo; nada delas foi gravado.
 * @param avisos linhas gravadas com alguma ressalva (ex.: motorista homônimo).
 */
public record ImportacaoVeiculoResponse(
        int totalLinhas,
        int veiculosCadastrados,
        int veiculosAtualizados,
        int motoristasCadastrados,
        int veiculosSemMotorista,
        int linhasComErro,
        List<OcorrenciaLinhaVeiculo> erros,
        List<OcorrenciaLinhaVeiculo> avisos) {}
