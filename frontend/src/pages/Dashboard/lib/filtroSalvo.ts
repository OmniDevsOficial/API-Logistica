import type { PeriodOption } from "@entities/dashboard-metrics";
import { referenciaDaDataIso } from "./intervaloDoPeriodo.ts";

const CHAVE_FILTRO = "newelog.dashboard.filtro";
const PERIODOS: readonly string[] = ["dia", "mes", "ano"];

export interface FiltroDashboard {
  periodo: PeriodOption;
  referencia: Date;
}

function paraDataIso(data: Date): string {
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${data.getFullYear()}-${mes}-${dia}`;
}

export function lerFiltroSalvo(
  armazenamento?: Pick<Storage, "getItem">,
): FiltroDashboard | null {
  try {
    const salvo = (armazenamento ?? sessionStorage).getItem(CHAVE_FILTRO);
    if (!salvo) return null;

    const { periodo, referencia } = JSON.parse(salvo) as Record<string, unknown>;
    if (typeof periodo !== "string" || !PERIODOS.includes(periodo)) return null;
    if (typeof referencia !== "string") return null;

    const data = referenciaDaDataIso(referencia);
    return data ? { periodo: periodo as PeriodOption, referencia: data } : null;
  } catch {
    return null;
  }
}

export function salvarFiltro(
  filtro: FiltroDashboard,
  armazenamento?: Pick<Storage, "setItem">,
): void {
  try {
    (armazenamento ?? sessionStorage).setItem(
      CHAVE_FILTRO,
      JSON.stringify({
        periodo: filtro.periodo,
        referencia: paraDataIso(filtro.referencia),
      }),
    );
  } catch {
    return;
  }
}
