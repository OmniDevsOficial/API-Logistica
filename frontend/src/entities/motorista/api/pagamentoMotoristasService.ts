import { apiFetch } from "../../../shared/api/apiFetch.ts";
import type { PagamentoMotorista, PeriodoRanking } from "../model/types";
import { parametrosDoPeriodo } from "../lib/parametrosDoPeriodo.ts";

/**
 * Valor a pagar por motorista no mês. Exclusivo do perfil Gestor.
 *
 * GET /api/operacional/dashboard/pagamento-motoristas?mes=2026-08
 *
 * ```json
 * [{ "motorista": "Ana", "cpf": "00123456789", "quantidadeViagens": 2, "valorAPagar": 1500.00 }]
 * ```
 */
const ENDPOINT = "/api/operacional/dashboard/pagamento-motoristas";

function validarItem(item: unknown): boolean {
  if (item === null || typeof item !== "object") return false;
  const registro = item as Record<string, unknown>;
  return (
    typeof registro.motorista === "string" &&
    (typeof registro.cpf === "string" || registro.cpf === null) &&
    typeof registro.quantidadeViagens === "number" &&
    Number.isFinite(Number(registro.valorAPagar))
  );
}

/**
 * Busca o pagamento consolidado de cada motorista no mês.
 *
 * @param periodo Mês no formato AAAA-MM ou intervalo dataInicio/dataFim (dd/MM/aaaa).
 * @param signal Cancela a requisição quando o período muda.
 * @returns Um item por motorista com viagens no mês.
 */
export async function buscarPagamentoMotoristas(
  periodo: PeriodoRanking,
  signal?: AbortSignal,
): Promise<PagamentoMotorista[]> {
  const parametros = new URLSearchParams(parametrosDoPeriodo(periodo));
  const resposta = await apiFetch(`${ENDPOINT}?${parametros}`, { signal });

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar o faturamento dos motoristas.");
  }

  const dados: unknown = await resposta.json();
  if (!Array.isArray(dados) || !dados.every(validarItem)) {
    throw new Error("A resposta de faturamento está inválida.");
  }

  return dados.map((item: Record<string, unknown>) => ({
    motorista: item.motorista as string,
    cpf: item.cpf as string | null,
    quantidadeViagens: item.quantidadeViagens as number,
    valorAPagar: Number(item.valorAPagar),
  }));
}
