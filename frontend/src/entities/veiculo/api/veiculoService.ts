import { apiFetch } from "../../../shared/api/apiFetch.ts";
import type { FiltroVeiculos, Veiculo, VeiculoResumo } from "../model/types.ts";

// Consulta disponível para gestor e operador. A importação fica em
// features/importar-veiculos (gestor e operador).
const ENDPOINT = "/api/operacional/veiculos";

function textoOuNulo(valor: unknown): string | null {
  return typeof valor === "string" && valor.trim() !== "" ? valor : null;
}

/**
 * Converte um item da API em `VeiculoResumo`, ou `null` se estiver fora do
 * contrato. Reutilizado pela lista de motoristas.
 */
export function lerVeiculoResumo(item: unknown): VeiculoResumo | null {
  if (item === null || typeof item !== "object" || Array.isArray(item)) return null;
  const dados = item as Record<string, unknown>;
  if (typeof dados.placa !== "string" || dados.placa.trim() === "") return null;

  return {
    placa: dados.placa,
    tipo: textoOuNulo(dados.tipo),
    modelo: textoOuNulo(dados.modelo),
    ativo: typeof dados.ativo === "boolean" ? dados.ativo : null,
  };
}

function lerVeiculo(item: unknown): Veiculo | null {
  const resumo = lerVeiculoResumo(item);
  if (!resumo) return null;
  const dados = item as Record<string, unknown>;
  if (!Number.isInteger(dados.id)) return null;

  return {
    ...resumo,
    id: dados.id as number,
    marca: textoOuNulo(dados.marca),
    motoristaId: Number.isInteger(dados.motoristaId) ? (dados.motoristaId as number) : null,
    motoristaNome: textoOuNulo(dados.motoristaNome),
  };
}

function lerLista(dados: unknown): Veiculo[] {
  if (!Array.isArray(dados)) throw new Error("A resposta do serviço está inválida.");
  const veiculos = dados.map(lerVeiculo);
  if (veiculos.some((veiculo) => veiculo === null)) {
    throw new Error("A resposta do serviço está inválida.");
  }
  return veiculos as Veiculo[];
}

/** Lista veículos ordenados por placa. Filtros ausentes não filtram. */
export async function buscarVeiculos(
  filtro: FiltroVeiculos = {},
  signal?: AbortSignal,
): Promise<Veiculo[]> {
  const parametros = new URLSearchParams();
  if (filtro.placa?.trim()) parametros.set("placa", filtro.placa.trim());
  if (filtro.tipo?.trim()) parametros.set("tipo", filtro.tipo.trim());
  if (filtro.motoristaId !== undefined) parametros.set("motoristaId", String(filtro.motoristaId));
  if (filtro.ativo !== undefined) parametros.set("ativo", String(filtro.ativo));
  const query = parametros.size > 0 ? `?${parametros}` : "";

  const resposta = await apiFetch(`${ENDPOINT}${query}`, { signal, cache: "no-store" });
  if (!resposta.ok) throw new Error("Não foi possível carregar os veículos.");

  return lerLista(await resposta.json());
}

/** Busca um veículo pela placa (qualquer formato). Retorna `null` se não existir. */
export async function buscarVeiculoPorPlaca(
  placa: string,
  signal?: AbortSignal,
): Promise<Veiculo | null> {
  const resposta = await apiFetch(`${ENDPOINT}/${encodeURIComponent(placa.trim())}`, {
    signal,
    cache: "no-store",
  });
  if (resposta.status === 404) return null;
  if (!resposta.ok) throw new Error("Não foi possível carregar o veículo.");

  const veiculo = lerVeiculo(await resposta.json());
  if (!veiculo) throw new Error("A resposta do serviço está inválida.");
  return veiculo;
}

/** Tipos cadastrados, em ordem alfabética, para filtros. */
export async function buscarTiposVeiculo(signal?: AbortSignal): Promise<string[]> {
  const resposta = await apiFetch(`${ENDPOINT}/tipos`, { signal, cache: "no-store" });
  if (!resposta.ok) throw new Error("Não foi possível carregar os tipos de veículo.");

  const dados: unknown = await resposta.json();
  if (!Array.isArray(dados) || !dados.every((tipo) => typeof tipo === "string")) {
    throw new Error("A resposta do serviço está inválida.");
  }
  return dados;
}
