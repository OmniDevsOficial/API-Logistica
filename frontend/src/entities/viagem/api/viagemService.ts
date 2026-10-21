import { apiFetch } from "../../../shared/api/apiFetch.ts";
import type { RentabilidadeViagem, Viagem, ViagensData } from "../model/types";

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
