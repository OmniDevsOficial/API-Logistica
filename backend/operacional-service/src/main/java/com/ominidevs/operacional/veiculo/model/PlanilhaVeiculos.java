package com.ominidevs.operacional.veiculo.model;

import java.util.List;

/**
 * Conteúdo lido do CSV de veículos.
 *
 * <p>As colunas opcionais só são aplicadas quando existem no cabeçalho: uma
 * planilha sem a coluna Modelo não apaga o modelo já cadastrado. Já a coluna
 * do motorista segue a regra da importação: sem motorista, o veículo fica sem
 * vínculo.
 *
 * @param linhas linhas de dados, sem linhas em branco.
 * @param possuiMarca cabeçalho tem a coluna Marca.
 * @param possuiModelo cabeçalho tem a coluna Modelo.
 * @param possuiStatus cabeçalho tem a coluna Status do Veículo.
 */
public record PlanilhaVeiculos(
        List<LinhaCsvVeiculo> linhas,
        boolean possuiMarca,
        boolean possuiModelo,
        boolean possuiStatus) {}
