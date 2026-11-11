import type { VeiculoResumo } from "../../veiculo/model/types.ts";

export type MotoristaStatus = "OK" | "SEM_VIAGENS";

export interface MotoristaUtilizacao {
  id: number | string;
  nome: string;
  percentualUtilizacao: number | null;
  status: MotoristaStatus;
  baixaUtilizacao: boolean;
}

export interface AlertaUtilizacao {
  id: number | string;
  nome: string;
  percentual: number;
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
  cpf: string | null;
  /** Tipo do veículo principal já formatado para exibição ("Cavalo mecânico") ou "-". */
  veiculo: string;
  /** Placa do veículo principal ou "-". */
  placa: string;
  /** Modelo (nome) do veículo principal; null quando não importado. */
  modelo: string | null;
  /** Demais veículos do motorista, além do principal. */
  outrosVeiculos: VeiculoResumo[];
  operacao: string;
  dataOperacao: string;
  localizacao: string;
  viagens: number;
  frequencia: number | null;
  baixaFrequencia: boolean;
  status: StatusEquipe;
}

export interface EquipeMotoristasData {
  totalMotoristas: number;
  disponiveis: number;
  emViagem: number;
  indisponiveis: number;
  motoristas: MotoristaEquipe[];
}

/**
 * Linha do ranking mensal de motoristas (US13). A ordenação vem do serviço:
 * o primeiro item é o 1º colocado do mês consultado.
 */
export interface RankingMotorista {
  /** Identificador repassado ao modal de detalhes (US17). */
  motoristaId: number | null;
  nome: string;
  /** CPF sem pontuação; exibido sob o nome quando não há telefone. */
  cpf: string | null;
  /** Telefone exibido sob o nome na lista. */
  telefone: string | null;
  /** Tipo do veículo exibido no pódio e na lista ("Truck"). */
  veiculo: string | null;
  placa: string | null;
  /** Viagens do motorista dentro do mês consultado. */
  viagens: number;
  /** Dias com viagem ÷ dias do mês × 100, em percentual (0 a 100). */
  frequencia: number | null;
  rentabilidadeMedia: number | null;
  /** Frete e custos somados no mês, usados no card do 1º colocado. */
  frete: number | null;
  custos: number | null;
}

/** Item do ranking com a posição que ele ocupa (1 = melhor rentabilidade). */
export interface RankingColocacao {
  posicao: number;
  motorista: RankingMotorista;
}
