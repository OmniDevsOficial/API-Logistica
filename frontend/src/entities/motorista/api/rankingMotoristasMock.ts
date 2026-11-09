import type { RankingMotorista } from "../model/types";

/**
 * Amostra de demonstração no formato do Figma, usada enquanto o backend da
 * ranking de motoristas não existe. Os números oscilam conforme o mês
 * consultado para deixar visível na tela que a troca de mês recarrega os
 * dados.
 */
interface LinhaDemonstracao {
  motoristaId: number;
  nome: string;
  telefone: string;
  veiculo: string;
  placa: string;
  viagens: number;
  frequencia: number;
  rentabilidadeMedia: number;
  frete?: number;
  custos?: number;
}

const TELEFONO_DEMO = "(11) 98125-5826";
const PLACA_DEMO = "RTA4F21";

const LINHAS_DEMO: LinhaDemonstracao[] = [
  { motoristaId: 1, nome: "João Silva", telefone: TELEFONO_DEMO, veiculo: "Truck", placa: PLACA_DEMO, viagens: 22, frequencia: 92, rentabilidadeMedia: 12500, frete: 18200, custos: 5700 },
  { motoristaId: 2, nome: "Thales Souza", telefone: TELEFONO_DEMO, veiculo: "Carreta", placa: PLACA_DEMO, viagens: 22, frequencia: 92, rentabilidadeMedia: 11200 },
  { motoristaId: 3, nome: "Jailson Nunes", telefone: TELEFONO_DEMO, veiculo: "Van", placa: PLACA_DEMO, viagens: 22, frequencia: 92, rentabilidadeMedia: 9600 },
  { motoristaId: 4, nome: "Carlos Henrique Souza", telefone: TELEFONO_DEMO, veiculo: "Truck", placa: PLACA_DEMO, viagens: 20, frequencia: 90, rentabilidadeMedia: 9870 },
  { motoristaId: 5, nome: "Ana Paula Ribeiro", telefone: TELEFONO_DEMO, veiculo: "Van", placa: PLACA_DEMO, viagens: 18, frequencia: 88, rentabilidadeMedia: 9340 },
  { motoristaId: 6, nome: "Marcos Vinícius Lima", telefone: TELEFONO_DEMO, veiculo: "Carreta", placa: PLACA_DEMO, viagens: 9, frequencia: 76, rentabilidadeMedia: 9340 },
  { motoristaId: 7, nome: "Juliana Torres", telefone: TELEFONO_DEMO, veiculo: "Fiorino", placa: PLACA_DEMO, viagens: 14, frequencia: 84, rentabilidadeMedia: 9870 },
  { motoristaId: 8, nome: "Roberto Alvez", telefone: TELEFONO_DEMO, veiculo: "Bitrem", placa: PLACA_DEMO, viagens: 22, frequencia: 95, rentabilidadeMedia: 9340 },
  { motoristaId: 9, nome: "Fernando Costa", telefone: TELEFONO_DEMO, veiculo: "Truck", placa: PLACA_DEMO, viagens: 12, frequencia: 81, rentabilidadeMedia: 9340 },
  { motoristaId: 10, nome: "Diego Martins Faria", telefone: TELEFONO_DEMO, veiculo: "Carreta", placa: PLACA_DEMO, viagens: 15, frequencia: 86, rentabilidadeMedia: 9340 },
  { motoristaId: 11, nome: "Luiz Fernando Rocha", telefone: TELEFONO_DEMO, veiculo: "Van", placa: PLACA_DEMO, viagens: 8, frequencia: 72, rentabilidadeMedia: 9340 },
];

/** Número pseudoaleatório estável em [-1, 1] a partir da semente. */
function oscilar(semente: number, indice: number): number {
  const x = Math.sin(semente * 12.9898 + indice * 78.233) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

/** dataInicio chega no formato dd/MM/aaaa, o mesmo das demais consultas. */
function sementeDoMes(dataInicio: string): number {
  const [, mes, ano] = dataInicio.split("/").map(Number);
  if (!mes || !ano) return 0;
  return ano * 12 + (mes - 1);
}

function arredondar(valor: number): number {
  return Number(valor.toFixed(2));
}

function comDesvio(valor: number, fator: number): number {
  return arredondar(valor * fator);
}

function montarLinha(linha: LinhaDemonstracao, indice: number, semente: number): RankingMotorista {
  const fator = 1 + oscilar(semente, indice * 3) * 0.12;

  return {
    motoristaId: linha.motoristaId,
    nome: linha.nome,
    cpf: null,
    telefone: linha.telefone,
    veiculo: linha.veiculo,
    placa: linha.placa,
    viagens: Math.max(1, Math.round(linha.viagens + oscilar(semente, indice * 3 + 1) * 3)),
    frequencia: Math.min(
      100,
      Math.max(40, Math.round(linha.frequencia + oscilar(semente, indice * 3 + 2) * 6)),
    ),
    rentabilidadeMedia: comDesvio(linha.rentabilidadeMedia, fator),
    frete: linha.frete === undefined ? null : comDesvio(linha.frete, fator),
    custos: linha.custos === undefined ? null : comDesvio(linha.custos, fator),
  };
}

function esperar(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason);
      return;
    }

    const temporizador = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(temporizador);
        reject(signal.reason);
      },
      { once: true },
    );
  });
}

/**
 * Ranking do mês em ordem decrescente de rentabilidade. O pequeno atraso
 * mantém a tela de carregamento visível, como aconteceria com a API real.
 */
export async function rankingDeDemonstracao(
  dataInicio: string,
  signal?: AbortSignal,
): Promise<RankingMotorista[]> {
  await esperar(250, signal);
  const semente = sementeDoMes(dataInicio);
  return LINHAS_DEMO.map((linha, indice) => montarLinha(linha, indice, semente));
}
