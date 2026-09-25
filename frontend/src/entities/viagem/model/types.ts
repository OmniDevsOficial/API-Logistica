export interface Viagem {
  id: number;
  origem: string;
  destino: string;
  freteEstimado: number;
  veiculo: string;
  distanciaKm: number;
  estimativaDias: number;
  status: StatusViagem;
}

export type StatusViagem = "disponivel" | "confirmada" | "concluida";

export interface ViagensData {
  periodoLabel: string;
  viagens: Viagem[];
}
