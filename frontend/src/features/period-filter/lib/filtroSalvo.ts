import type { PeriodOption } from "@entities/dashboard-metrics";
import { referenciaDaDataIso } from "./intervaloDoPeriodo.ts";

const PERIODOS: readonly string[] = ["dia", "mes", "ano"];

export interface FiltroPeriodo {
  periodo: PeriodOption;
  referencia: Date;
}

function paraDataIso(data: Date): string {
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${data.getFullYear()}-${mes}-${dia}`;
}

function chaveDaTela(tela: string): string {
  return `newelog.${tela}.filtro`;
}

export function lerFiltroSalvo(
  tela: string,
  armazenamento?: Pick<Storage, "getItem">,
): FiltroPeriodo | null {
  try {
    const salvo = (armazenamento ?? sessionStorage).getItem(chaveDaTela(tela));
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
  tela: string,
  filtro: FiltroPeriodo,
  armazenamento?: Pick<Storage, "setItem">,
): void {
  try {
    (armazenamento ?? sessionStorage).setItem(
      chaveDaTela(tela),
      JSON.stringify({
        periodo: filtro.periodo,
        referencia: paraDataIso(filtro.referencia),
      }),
    );
  } catch {
    return;
  }
}
