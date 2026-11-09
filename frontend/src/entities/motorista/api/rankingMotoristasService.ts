import { apiFetch } from "../../../shared/api/apiFetch.ts";
import type { RankingMotorista } from "../model/types";
import { rankingDeDemonstracao } from "./rankingMotoristasMock.ts";

/**
 * Ranking mensal de motoristas por rentabilidade média.
 *
 * GET /api/operacional/motoristas/ranking?dataInicio=01/11/2026&dataFim=30/11/2026
 *
 * Resposta: lista ordenada da melhor para a pior rentabilidade, sem posição
 * explícita — a posição é a ordem do array:
 *
 * ```json
 * [
 *   {
 *     "posicao": 1,
 *     "motoristaId": 1,
 *     "nome": "João Silva",
 *     "cpf": "12345678901",
 *     "telefone": null,
 *     "veiculo": "Truck",
 *     "placa": "RTA4F21",
 *     "viagens": 22,
 *     "frequencia": 92.0,
 *     "rentabilidadeMedia": 12500.00,
 *     "frete": 18200.00,
 *     "custos": 5700.00
 *   }
 * ]
 * ```
 */
const ENDPOINT = "/api/operacional/motoristas/ranking";

/**
 * Enquanto o backend não entregava o endpoint acima, a tela consumia a amostra
 * de demonstração (ver `rankingMotoristasMock`). A API existe agora, então a
 * flag ficou em `false`; reative apenas se precisar da amostra localmente.
 */
const RANKING_EM_DEMONSTRACAO = false;

function numeroOuNulo(valor: unknown): number | null {
  if (valor === null || valor === undefined || valor === "") return null;
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : null;
}

function textoOuNulo(valor: unknown): string | null {
  return typeof valor === "string" && valor.trim() !== "" ? valor : null;
}

function validarItem(item: unknown): item is RankingMotorista {
  if (item === null || typeof item !== "object") return false;
  const registro = item as Partial<RankingMotorista>;
  return typeof registro.nome === "string" && typeof registro.viagens === "number";
}

function mapear(item: RankingMotorista): RankingMotorista {
  return {
    motoristaId: typeof item.motoristaId === "number" ? item.motoristaId : null,
    nome: item.nome,
    cpf: textoOuNulo(item.cpf),
    telefone: textoOuNulo(item.telefone),
    veiculo: textoOuNulo(item.veiculo),
    placa: textoOuNulo(item.placa),
    viagens: item.viagens,
    frequencia: numeroOuNulo(item.frequencia),
    rentabilidadeMedia: numeroOuNulo(item.rentabilidadeMedia),
    frete: numeroOuNulo(item.frete),
    custos: numeroOuNulo(item.custos),
  };
}

export async function buscarRankingMotoristas(
  dataInicio: string,
  dataFim: string,
  signal?: AbortSignal,
): Promise<RankingMotorista[]> {
  if (RANKING_EM_DEMONSTRACAO) {
    return rankingDeDemonstracao(dataInicio, signal);
  }

  const parametros = new URLSearchParams({ dataInicio, dataFim });
  const resposta = await apiFetch(`${ENDPOINT}?${parametros}`, { signal });

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar o ranking de motoristas.");
  }

  const dados: unknown = await resposta.json();
  if (!Array.isArray(dados) || !dados.every(validarItem)) {
    throw new Error("A resposta do ranking está inválida.");
  }

  return dados.map(mapear);
}
