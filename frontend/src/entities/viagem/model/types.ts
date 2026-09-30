export type StatusViagem = "disponivel" | "confirmada" | "concluida";

export interface Viagem {
  id: string;
  origem: string;
  destino: string;
  freteEstimado: number;
  veiculo: string;
  distanciaKm: number;
  estimativaDias: number;
  status: StatusViagem;
}

export interface ViagensData {
  periodoLabel: string;
  viagens: Viagem[];
}
