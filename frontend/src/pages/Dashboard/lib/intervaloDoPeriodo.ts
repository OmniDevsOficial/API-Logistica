import type { PeriodOption } from "@entities/dashboard-metrics";

export interface IntervaloConsulta {
  dataInicio: string;
  dataFim: string;
}

const FORMATADOR = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function intervaloDoPeriodo(
  periodo: PeriodOption,
  hoje = new Date(),
): IntervaloConsulta {
  const inicio = new Date(hoje);

  if (periodo === "mes") inicio.setDate(1);
  if (periodo === "ano") inicio.setMonth(0, 1);

  return {
    dataInicio: FORMATADOR.format(inicio),
    dataFim: FORMATADOR.format(hoje),
  };
}
