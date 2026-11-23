import { apiFetch } from "../../../shared/api/apiFetch.ts";
import type { FiltroRanking, PeriodoRanking, RankingMotorista, ResultadoRankingMotoristas } from "../model/types";
import { parametrosDoPeriodo } from "../lib/parametrosDoPeriodo.ts";
import { rankingDeDemonstracao } from "./rankingMotoristasMock.ts";

/**
 * Ranking mensal de motoristas. A ordenação vem pronta do backend.
 *
 * GET /api/operacional/motoristas/ranking?mes=2026-11&filtro=RENTABILIDADE
 *
 * Resposta inclui o ranking e os tipos encontrados no mês:
 *
 * ```json
 * {
 *   "ranking": [{
 *     "posicao": 1,
 *     "motoristaId": 1,
 *     "nome": "João Silva",
 *     "cpf": "12345678901",
 *     "telefone": null,
 *     "veiculo": "Truck",
 *     "placa": "RTA4F21",
 *     "viagens": 22,
 *     "rentabilidadeMedia": 12500.00,
 *     "faturamento": 18200.00,
 *     "custos": 5700.00
 *   }],
 *   "tiposDisponiveis": ["TRUCK", "VAN"]
 * }
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
    faturamento: numeroOuNulo(item.faturamento),
    rentabilidadeTotal: numeroOuNulo(item.rentabilidadeTotal),
    custos: numeroOuNulo(item.custos),
  };
}

export async function buscarRankingMotoristas(
  periodo: PeriodoRanking,
  filtro: FiltroRanking = "RENTABILIDADE",
  tipoVeiculo?: string,
  signal?: AbortSignal,
): Promise<ResultadoRankingMotoristas> {
  if (RANKING_EM_DEMONSTRACAO) {
    const referencia = typeof periodo === "string" ? periodo : periodo.dataInicio;
    return rankingDeDemonstracao(referencia, filtro, tipoVeiculo, signal);
  }

  const parametros = new URLSearchParams({ ...parametrosDoPeriodo(periodo), filtro });
  if (filtro === "TIPO_VEICULO" && tipoVeiculo) {
    parametros.set("tipoVeiculo", tipoVeiculo);
  }
  const resposta = await apiFetch(`${ENDPOINT}?${parametros}`, { signal });

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar o ranking de motoristas.");
  }

  const dados: unknown = await resposta.json();
  if (dados === null || typeof dados !== "object") {
    throw new Error("A resposta do ranking está inválida.");
  }

  const resultado = dados as Partial<ResultadoRankingMotoristas>;
  if (!Array.isArray(resultado.ranking) || !resultado.ranking.every(validarItem)
      || !Array.isArray(resultado.tiposDisponiveis)
      || !resultado.tiposDisponiveis.every((tipo) => typeof tipo === "string")) {
    throw new Error("A resposta do ranking está inválida.");
  }

  return {
    ranking: resultado.ranking.map(mapear),
    tiposDisponiveis: resultado.tiposDisponiveis,
  };
}
