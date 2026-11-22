import type { PeriodoRanking } from "../model/types";

export function parametrosDoPeriodo(periodo: PeriodoRanking): Record<string, string> {
  return typeof periodo === "string"
    ? { mes: periodo }
    : { dataInicio: periodo.dataInicio, dataFim: periodo.dataFim };
}
