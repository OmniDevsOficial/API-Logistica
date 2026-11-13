package com.ominidevs.operacional.motorista.dto;

import java.math.BigDecimal;

/**
 * Item do ranking mensal de motoristas (US13). A lista vem ordenada pelo
 * Comparator do serviço (rentabilidade média, quantidade de viagens,
 * frequência e, por fim, nome) e a posição é atribuída depois da ordenação,
 * de 1 a n. Motoristas sem viagem no mês não aparecem.
 *
 * @param posicao             1-based, sequencial após a ordenação
 * @param motoristaId         id do cadastro resolvido pelo CPF do manifesto;
 *                            null quando não há correspondência
 * @param cpf                 CPF com 11 dígitos (sem pontuação, o front formata);
 *                            exibido sob o nome como fallback do telefone
 * @param telefone            o cadastro ainda não possui telefone (sempre null)
 * @param veiculo             tipo do veículo (cadastro ou última viagem do mês)
 * @param placa               placa do veículo (cadastro ou última viagem do mês)
 * @param viagens             viagens do motorista no período (alias de
 *                            {@code quantidadeViagens}, consumido pelo front)
 * @param quantidadeViagens   viagens do motorista no período
 * @param frequencia          dias em operação ÷ 30 × 100
 * @param rentabilidadeMedia  rentabilidadeTotal ÷ quantidadeViagens (média da US09)
 * @param rentabilidadeTotal  Σ (receita_frete − vale_frete) no período
 * @param frete               Σ receita_frete no período
 * @param custos              Σ vale_frete no período (entra na rentabilidade)
 */
public record RankingMotoristaResponse(
        int posicao,
        Integer motoristaId,
        String nome,
        String cpf,
        String telefone,
        String veiculo,
        String placa,
        long viagens,
        long quantidadeViagens,
        BigDecimal frequencia,
        BigDecimal rentabilidadeMedia,
        BigDecimal rentabilidadeTotal,
        BigDecimal frete,
        BigDecimal custos) {}
