export interface Viagem {
  id: number;
  manifesto: string;
  data: string;
  origem: string;
  destino: string;
  freteEstimado: number;
  veiculo: string;
  distanciaKm: number;
  estimativaDias: number;
  status: StatusViagem;
}

export interface RentabilidadeViagem {
  receita: number | null;
  custo: number | null;
  rentabilidade: number | null;
}

export type StatusViagem = "pendente" | "em_transito" | "finalizado";

export interface ViagensData {
  periodoLabel: string;
  viagens: Viagem[];
}
