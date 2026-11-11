import type { RankingColocacao, RankingMotorista } from "@entities/motorista";

export interface DistribuicaoRanking {
  /** Os 3 primeiros colocados, em ordem de posição (1º, 2º, 3º). */
  podio: RankingColocacao[];
  /** Do 4º em diante; vazio quando há 3 motoristas ou menos. */
  lista: RankingColocacao[];
}

/**
 * Separa o ranking do mês entre pódio (3 primeiros) e lista (demais). A
 * posição vem da ordem do serviço: o primeiro item é o 1º colocado.
 */
export function distribuirRanking(
  ranking: RankingMotorista[],
): DistribuicaoRanking {
  const colocacoes = ranking.map((motorista, indice) => ({
    posicao: indice + 1,
    motorista,
  }));

  return {
    podio: colocacoes.slice(0, 3),
    lista: colocacoes.slice(3),
  };
}
