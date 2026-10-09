export type MotoristaStatus = "OK" | "SEM_VIAGENS";

export interface MotoristaUtilizacao {
  id: number | string;
  nome: string;
  percentualUtilizacao: number | null;
  status: MotoristaStatus;
}

export type StatusEquipe = "disponivel" | "em_viagem" | "indisponivel";

export interface MotoristaEquipe {
  id: number | string;
  nome: string;
  telefone: string;
  veiculo: string;
  placa: string;
  operacao: string;
  dataOperacao: string;
  localizacao: string;
  viagens: number;
  status: StatusEquipe;
}
