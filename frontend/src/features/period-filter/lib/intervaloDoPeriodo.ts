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

function semHoras(data: Date): Date {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate());
}

function inicioDoPeriodo(periodo: PeriodOption, referencia: Date): Date {
  const inicio = semHoras(referencia);

  if (periodo === "mes") inicio.setDate(1);
  if (periodo === "ano") inicio.setMonth(0, 1);

  return inicio;
}

function fimDoPeriodo(periodo: PeriodOption, referencia: Date): Date {
  const fim = semHoras(referencia);

  if (periodo === "mes") fim.setMonth(fim.getMonth() + 1, 0);
  if (periodo === "ano") fim.setMonth(11, 31);

  return fim;
}

export function intervaloDoPeriodo(
  periodo: PeriodOption,
  referencia = new Date(),
): IntervaloConsulta {
  return {
    dataInicio: FORMATADOR.format(inicioDoPeriodo(periodo, referencia)),
    dataFim: FORMATADOR.format(fimDoPeriodo(periodo, referencia)),
  };
}

export function deslocarReferencia(
  periodo: PeriodOption,
  referencia: Date,
  passos: number,
): Date {
  const deslocada = semHoras(referencia);

  if (periodo === "dia") deslocada.setDate(deslocada.getDate() + passos);
  if (periodo === "mes") deslocada.setMonth(deslocada.getMonth() + passos, 1);
  if (periodo === "ano") deslocada.setFullYear(deslocada.getFullYear() + passos, 0, 1);

  return deslocada;
}

export function podeAvancarPeriodo(
  periodo: PeriodOption,
  referencia: Date,
  hoje = new Date(),
): boolean {
  return fimDoPeriodo(periodo, referencia) < semHoras(hoje);
}

export function referenciaDaDataIso(dataIso: string): Date | null {
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dataIso);
  if (!partes) return null;

  const [, ano, mes, dia] = partes;
  return new Date(Number(ano), Number(mes) - 1, Number(dia));
}
