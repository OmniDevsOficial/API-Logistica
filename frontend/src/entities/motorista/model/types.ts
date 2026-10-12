export type MotoristaStatus = "OK" | "SEM_VIAGENS";

export interface MotoristaUtilizacao {
  id: number | string;
  nome: string;
  percentualUtilizacao: number | null;
  status: MotoristaStatus;
}

export interface MotoristaResumo {
  disponiveis: number;
  emOperacao: number;
  indisponiveis: number;
  total: number;
}
