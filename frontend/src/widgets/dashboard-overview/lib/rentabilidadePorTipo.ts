import type { RentabilidadeTipoVeiculo } from "@entities/dashboard-metrics";
import { formatTipoVeiculo } from "../../../shared/lib/format.ts";
import { tetoArredondado } from "./eixoDoGrafico.ts";

export type DestaqueDaBarra = "positivo" | "negativo" | "neutro";

export interface BarraTipoVeiculo extends RentabilidadeTipoVeiculo {
  rotulo: string;
  destaque: DestaqueDaBarra;
}

export const ROTULO_NAO_IDENTIFICADO = "Não identificado";
export const LEGENDA_NAO_IDENTIFICADO =
  "Tipo não cadastrado, importe a planilha de veículos";

const FRACAO_MINIMA_DA_MARCACAO_NEGATIVA = 0.15;

function destaque(tipo: RentabilidadeTipoVeiculo): DestaqueDaBarra {
  if (tipo.naoIdentificado) return "neutro";
  return tipo.rentabilidade < 0 ? "negativo" : "positivo";
}

export function barrasDoGrafico(tipos: RentabilidadeTipoVeiculo[]): BarraTipoVeiculo[] {
  return tipos.map((tipo) => ({
    ...tipo,
    rotulo: tipo.naoIdentificado
      ? ROTULO_NAO_IDENTIFICADO
      : formatTipoVeiculo(tipo.tipo) ?? tipo.tipo,
    destaque: destaque(tipo),
  }));
}

export interface EixoDoGrafico {
  dominio: [number, number];
  marcacoes: number[];
}

export function eixoDoGrafico(valores: number[]): EixoDoGrafico {
  const maior = Math.max(0, ...valores);
  const menor = Math.min(0, ...valores);
  const teto = maior > 0 ? tetoArredondado(maior) : 0;
  const piso = menor < 0 ? -tetoArredondado(-menor) : 0;

  if (teto === 0 && piso === 0) {
    return { dominio: [0, 1], marcacoes: [0] };
  }

  if (teto === 0) {
    return { dominio: [piso, 0], marcacoes: [piso, piso / 2, 0] };
  }

  const marcacoes = [0, teto / 2, teto];
  if (piso < 0 && -piso >= teto * FRACAO_MINIMA_DA_MARCACAO_NEGATIVA) {
    marcacoes.unshift(piso);
  }

  return { dominio: [piso, teto], marcacoes };
}
