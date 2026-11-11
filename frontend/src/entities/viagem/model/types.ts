export interface Viagem {
  id: number;
  manifesto: string;
  data: string;
  origem: string | null;
  destino: string | null;
  freteEstimado: number | null;
  veiculo: string;
  distanciaKm: number;
  estimativaDias: number;
  status: StatusViagem;
  receita: number | null;
  /** Vale frete. */
  custo: number | null;
  rentabilidade: number | null;
}

export interface RentabilidadeViagem {
  receita: number | null;
  custo: number | null;
  rentabilidade: number | null;
}

export interface RankingDestino {
  origem: string | null;
  destino: string;
  quantidadeViagens: number;
  rentabilidadeMedia: number;
}

export type StatusViagem ="pendente" | "em_transito" | "finalizado";

export interface ViagensData {
  periodoLabel: string;
  viagens: Viagem[];
}
