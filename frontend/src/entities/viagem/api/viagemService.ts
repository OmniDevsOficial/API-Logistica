import { apiFetch } from "../../../shared/api/apiFetch.ts";
import type {
  RankingDestino,
  RentabilidadeViagem,
  Viagem,
  ViagensData,
} from "../model/types";

export async function getViagensData(): Promise<ViagensData> {
  const response = await apiFetch("/api/operacional/viagens");
  if (!response.ok) throw new Error("Não foi possível carregar as viagens.");
  const viagens = (await response.json()) as Viagem[];
  return { periodoLabel: "", viagens };
}

export async function getRentabilidade(manifesto: string): Promise<RentabilidadeViagem> {
  const response = await apiFetch(
    `/api/operacional/viagens/${encodeURIComponent(manifesto)}/rentabilidade`,
  );
  if (!response.ok) throw new Error("Não foi possível carregar a rentabilidade.");
  return (await response.json()) as RentabilidadeViagem;
}

// TOP 10 rotas do período (dd/MM/aaaa) ordenadas pelo backend (rentabilidade média).
export async function getRankingDestinos(
  dataInicio: string,
  dataFim: string,
  signal?: AbortSignal,
): Promise<RankingDestino[]> {
  const params = new URLSearchParams({ dataInicio, dataFim });
  const response = await apiFetch(
    `/api/operacional/viagens/ranking-destinos?${params.toString()}`,
    { signal },
  );
  if (!response.ok) throw new Error("Não foi possível carregar o ranking de destinos.");
  return (await response.json()) as RankingDestino[];
}
