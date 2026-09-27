// Chamada pro endpoint de filtro. Só monta a query string com o que
// o operador de fato preencheu

import type { FiltroViagens } from "../model/types";
import type { StatusViagem } from "../model/types";

export async function filtrarViagensApi(filtro: FiltroViagens) {
  const params = new URLSearchParams();
  //Transforma o status em MAIUSCULO para ser recebido no mesmo formato do enum na API
  const statusParaApi = (status: StatusViagem): string => {
    return status.toUpperCase();
  };

  if (filtro.destino) params.set("destino", filtro.destino);
  filtro.status.forEach((s) => params.append("status", statusParaApi(s)));
  if (filtro.freteMin !== null) params.set("freteMin", String(filtro.freteMin));
  if (filtro.freteMax !== null) params.set("freteMax", String(filtro.freteMax));
  if (filtro.mes) params.set("mes", filtro.mes);

  const response = await fetch(`/api/operacional/viagens?${params}`);

  if (!response.ok) {
    throw new Error(`Erro ao filtrar: ${response.statusText}`);
  }

  return response.json();
}
