import type { StatusEquipe, MotoristaEquipe } from "../model/types";

const MOTORISTAS_MOCK: MotoristaEquipe[] = [
  {
    id: 1,
    nome: "Carlos Henrique Souza",
    telefone: "(11) 98125-5826",
    veiculo: "Truck",
    placa: "RTA4F21",
    operacao: "Previsão de retorno",
    dataOperacao: "Hoje, 14:50",
    localizacao: "Guarulhos/SP",
    viagens: 20,
    status: "em_viagem",
  },
  {
    id: 2,
    nome: "Ana Paula Ribeiro",
    telefone: "(11) 98125-5826",
    veiculo: "Van",
    placa: "RTA4F21",
    operacao: "Última operação",
    dataOperacao: "Hoje, 11:20",
    localizacao: "Campinas/SP",
    viagens: 18,
    status: "disponivel",
  },
  {
    id: 3,
    nome: "Marcos Vinícius Lima",
    telefone: "(11) 98125-5826",
    veiculo: "Carreta",
    placa: "RTA4F21",
    operacao: "Previsão de disponibilidade",
    dataOperacao: "06/10, 13:55",
    localizacao: "São Paulo/SP",
    viagens: 9,
    status: "indisponivel",
  },
  {
    id: 4,
    nome: "Juliana Torres",
    telefone: "(11) 98125-5826",
    veiculo: "Fiorino",
    placa: "RTA4F21",
    operacao: "Previsão de retorno",
    dataOperacao: "04/10, 19:53",
    localizacao: "São José Dos Campos/SP",
    viagens: 14,
    status: "em_viagem",
  },
  {
    id: 5,
    nome: "Roberto Alvez",
    telefone: "(11) 98125-5826",
    veiculo: "Bitrem",
    placa: "RTA4F21",
    operacao: "Última operação",
    dataOperacao: "Hoje, 12:20",
    localizacao: "Campinas/SP",
    viagens: 22,
    status: "disponivel",
  },
  {
    id: 6,
    nome: "Fernando Costa",
    telefone: "(11) 98125-5826",
    veiculo: "Truck",
    placa: "RTA4F21",
    operacao: "Previsão de retorno",
    dataOperacao: "09/10, 05:38",
    localizacao: "Jacareí/SP",
    viagens: 12,
    status: "em_viagem",
  },
  {
    id: 7,
    nome: "Diego Martins Faria",
    telefone: "(11) 98125-5826",
    veiculo: "Carreta",
    placa: "RTA4F21",
    operacao: "Previsão de disponibilidade",
    dataOperacao: "Hoje, 14:50",
    localizacao: "São José Dos Campos/SP",
    viagens: 15,
    status: "indisponivel",
  },
  {
    id: 8,
    nome: "Luiz Fernando Rocha",
    telefone: "(11) 98125-5826",
    veiculo: "Van",
    placa: "RTA4F21",
    operacao: "Última operação",
    dataOperacao: "Hoje, 09:15",
    localizacao: "Taubaté/SP",
    viagens: 8,
    status: "disponivel",
  },
];

export interface EquipeMotoristasData {
  totalMotoristas: number;
  disponiveis: number;
  emViagem: number;
  indisponiveis: number;
  motoristas: MotoristaEquipe[];
}

export function getEquipeMotoristasData(
  filtro?: StatusEquipe | null,
): EquipeMotoristasData {
  const motoristas = filtro
    ? MOTORISTAS_MOCK.filter((m) => m.status === filtro)
    : MOTORISTAS_MOCK;

  return {
    totalMotoristas: 1563,
    disponiveis: 965,
    emViagem: 398,
    indisponiveis: 200,
    motoristas,
  };
}
