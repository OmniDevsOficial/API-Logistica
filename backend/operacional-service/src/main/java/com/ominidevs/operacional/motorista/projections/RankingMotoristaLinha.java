package com.ominidevs.operacional.motorista.projections;

import java.math.BigDecimal;

/**
 * Agregação por motorista (coluna Motorista do manifesto) dentro do período
 * consultado. Vem do SQL já agregado; a rentabilidade média, a frequência,
 * a ordenação e a posição são calculadas no serviço.
 *
 * @param nome                MIN(TRIM(motorista)) do grupo, como no manifesto
 * @param motoristaId         id do cadastro casado pelo CPF normalizado
 * @param cpf                 CPF cru do cadastro ou da última viagem (fallback
 *                            exibido sob o nome, já que não há telefone)
 * @param veiculo             tipo do veículo: cadastro, senão a última viagem
 * @param placa               placa do veículo: cadastro, senão a última viagem
 * @param quantidadeViagens   COUNT(*) das viagens do grupo no período
 * @param diasComViagem       COUNT(DISTINCT data) das viagens do grupo
 * @param frete               Σ receita_frete
 * @param custos              Σ vale_frete
 * @param rentabilidadeTotal  Σ (receita_frete − vale_frete), nulos ignorados
 */
public record RankingMotoristaLinha(
        String nome,
        Integer motoristaId,
        String cpf,
        String veiculo,
        String placa,
        long quantidadeViagens,
        long diasComViagem,
        BigDecimal frete,
        BigDecimal custos,
        BigDecimal rentabilidadeTotal) {}
