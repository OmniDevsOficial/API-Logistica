import type { IntervaloConsulta } from "../../../features/period-filter/lib/intervaloDoPeriodo.ts";

interface ComData {
  data: string;
}

function paraDataIso(dataBr: string): string {
  const [dia, mes, ano] = dataBr.split("/");
  return `${ano}-${mes}-${dia}`;
}

export function viagensNoPeriodo<T extends ComData>(
  viagens: T[],
  intervalo: IntervaloConsulta,
): T[] {
  const inicio = paraDataIso(intervalo.dataInicio);
  const fim = paraDataIso(intervalo.dataFim);
  return viagens.filter((viagem) => viagem.data >= inicio && viagem.data <= fim);
}
