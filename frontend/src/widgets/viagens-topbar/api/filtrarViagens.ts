// Chamada pro endpoint de filtro. Só monta a query string com o que
// o operador de fato preencheu

import type { FiltroViagens } from "../model/types";

export async function filtrarViagensApi(filtro: FiltroViagens) {
  const params = new URLSearchParams();

  if (filtro.destino) params.set("destino", filtro.destino);
  filtro.status.forEach((s) => params.append("status", s));
  if (filtro.freteMin !== null) params.set("freteMin", String(filtro.freteMin));
  if (filtro.freteMax !== null) params.set("freteMax", String(filtro.freteMax));
  if (filtro.mes) params.set("mes", filtro.mes);

  const response = await fetch(`/api/operacional/viagens?${params}`);

  if (!response.ok) {
    throw new Error(`Erro ao filtrar: ${response.statusText}`);
  }

  return response.json();
}