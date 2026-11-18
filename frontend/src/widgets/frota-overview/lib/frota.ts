import type { QuantidadeFrota } from "../../../entities/veiculo/model/types.ts";
import { formatTipoVeiculo } from "../../../shared/lib/format.ts";

export const ROTULO_NAO_IDENTIFICADO = "Não identificado";
export const ROTULO_OUTRAS = "Outras";
const NAO_IDENTIFICADO = "NAO_IDENTIFICADO";

export interface BarraFrota {
  chave: string;
  rotulo: string;
  quantidade: number;
}

export function rotuloTipo(tipo: string | null): string {
  if (!tipo || tipo === NAO_IDENTIFICADO) return ROTULO_NAO_IDENTIFICADO;
  return formatTipoVeiculo(tipo) ?? tipo;
}

export function rotuloNome(nome: string | null): string {
  if (!nome || nome === NAO_IDENTIFICADO) return ROTULO_NAO_IDENTIFICADO;
  return nome
    .trim()
    .toLocaleLowerCase("pt-BR")
    .split(/\s+/)
    .map((palavra) => palavra.charAt(0).toLocaleUpperCase("pt-BR") + palavra.slice(1))
    .join(" ");
}

export function barrasComOutras(
  itens: QuantidadeFrota[],
  rotular: (nome: string) => string,
  limite: number,
): BarraFrota[] {
  const barras = itens.map(({ nome, quantidade }) => ({
    chave: nome,
    rotulo: rotular(nome),
    quantidade,
  }));
  if (barras.length <= limite) return barras;

  const restantes = barras.slice(limite - 1);
  return [
    ...barras.slice(0, limite - 1),
    {
      chave: ROTULO_OUTRAS,
      rotulo: `${ROTULO_OUTRAS} (${restantes.length})`,
      quantidade: restantes.reduce((total, barra) => total + barra.quantidade, 0),
    },
  ];
}

export function percentualDe(parte: number, total: number): number {
  return total === 0 ? 0 : (parte * 100) / total;
}

export function formatarPercentual(valor: number): string {
  return `${valor.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
}

export function formatarAtualizadoEm(valor: string | null): string {
  if (!valor) return "-";
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return "-";
  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
