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

export type StatusEquipe = "disponivel" | "em_viagem" | "indisponivel";

export interface MotoristaEquipe {
  id: number;
  nome: string;
  veiculo: string;
  placa: string;
  operacao: string;
  dataOperacao: string;
  localizacao: string;
  viagens: number;
  status: StatusEquipe;
}

export interface EquipeMotoristasData {
  totalMotoristas: number;
  disponiveis: number;
  emViagem: number;
  indisponiveis: number;
  motoristas: MotoristaEquipe[];
}
