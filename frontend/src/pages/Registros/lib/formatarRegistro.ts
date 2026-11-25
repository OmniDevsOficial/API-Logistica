import type { ImportacaoHistorico, TipoImportacao } from "@entities/importacao";

const FORMATO_DATA = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const FORMATO_HORA = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export const LABEL_TIPO: Record<TipoImportacao, string> = {
  manifesto: "Manifesto",
  veiculos: "Veículos",
};

/** "12/11/2026" */
export function formatarData(data: Date): string {
  return FORMATO_DATA.format(data);
}

/** "14:32" */
export function formatarHora(data: Date): string {
  return FORMATO_HORA.format(data);
}

/** "12/11/2026 às 14:32" */
export function formatarDataHora(data: Date): string {
  return `${formatarData(data)} às ${formatarHora(data)}`;
}

/** Quem enviou o arquivo; sem token o back não tem como saber. */
export function usuarioDaImportacao(linha: ImportacaoHistorico): string {
  return linha.usuario ?? "Usuário não identificado";
}
