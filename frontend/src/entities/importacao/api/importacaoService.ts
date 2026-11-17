import { apiFetch } from "../../../shared/api/apiFetch.ts";
import type {
  ImportacaoHistorico,
  ResumoImportacoes,
  StatusImportacao,
  TipoImportacao,
} from "../model/types.ts";

// Gestor e operador consultam o histórico (mesma regra de quem importa).
const ENDPOINT = "/api/operacional/importacoes";

export interface FiltroConsultaImportacoes {
  /**
   * Cada origem é consultada em uma chamada própria, para que a falha de um
   * serviço não esconda as importações do outro.
   */
  tipo: TipoImportacao;
  /** "todos" fica de fora do parâmetro. */
  status?: StatusImportacao;
  /** Período "de" em aaaa-mm-dd, inclusive. */
  de?: string;
  /** Período "até" em aaaa-mm-dd, inclusive. */
  ate?: string;
}

const TIPOS: Record<string, TipoImportacao> = {
  manifesto: "manifesto",
  MANIFESTO: "manifesto",
  veiculo: "veiculos",
  VEICULO: "veiculos",
  veiculos: "veiculos",
  VEICULOS: "veiculos",
};

const STATUS: Record<string, StatusImportacao> = {
  sucesso: "sucesso",
  SUCESSO: "sucesso",
  parcial: "parcial",
  PARCIAL: "parcial",
  erro: "erro",
  ERRO: "erro",
};

function texto(valor: unknown): string | null {
  return typeof valor === "string" && valor.trim() !== "" ? valor : null;
}

function lerDataHora(valor: unknown): Date | null {
  if (typeof valor !== "string" || valor.trim() === "") return null;
  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? null : data;
}

function lerResumo(valor: unknown): ResumoImportacoes | null {
  if (valor === null || typeof valor !== "object" || Array.isArray(valor)) return null;
  const resumo = valor as Record<string, unknown>;
  const campos: (keyof ResumoImportacoes)[] = ["criados", "atualizados", "ignorados", "rejeitados"];
  if (!campos.every((campo) => Number.isInteger(resumo[campo]))) return null;

  return {
    criados: resumo.criados as number,
    atualizados: resumo.atualizados as number,
    ignorados: resumo.ignorados as number,
    rejeitados: resumo.rejeitados as number,
  };
}

/** Converte uma linha da API, ou `null` quando está fora do contrato. */
export function lerImportacao(item: unknown): ImportacaoHistorico | null {
  if (item === null || typeof item !== "object" || Array.isArray(item)) return null;
  const linha = item as Record<string, unknown>;

  const tipo = linha.tipo === undefined || linha.tipo === null ? null : TIPOS[String(linha.tipo)];
  const status = linha.status === undefined || linha.status === null ? null : STATUS[String(linha.status)];
  const dataHora = lerDataHora(linha.dataHora);
  const arquivo = texto(linha.arquivo);
  const resumo = lerResumo(linha.resumo);
  if (!Number.isInteger(linha.id) || !tipo || !status || !dataHora || !arquivo || !resumo) return null;

  return {
    chave: `${tipo}:${linha.id}`,
    id: linha.id as number,
    tipo,
    dataHora,
    arquivo,
    usuario: texto(linha.usuario),
    status,
    resumo,
    reimportacaoDe: lerDataHora(linha.reimportacaoDe),
  };
}

function lerLista(dados: unknown): ImportacaoHistorico[] {
  if (!Array.isArray(dados)) throw new Error("A resposta do serviço está inválida.");
  const linhas = dados.map(lerImportacao);
  if (linhas.some((linha) => linha === null)) {
    throw new Error("A resposta do serviço está inválida.");
  }
  return linhas as ImportacaoHistorico[];
}

/**
 * Lista as importações de uma origem, da mais recente para a mais antiga.
 * Os filtros de status e período são do back; a busca pelo nome do arquivo é
 * feita na tela, sobre a lista já baixada.
 */
export async function buscarImportacoes(
  filtro: FiltroConsultaImportacoes,
  signal?: AbortSignal,
): Promise<ImportacaoHistorico[]> {
  const parametros = new URLSearchParams();
  parametros.set("tipo", filtro.tipo);
  if (filtro.status) parametros.set("status", filtro.status);
  if (filtro.de) parametros.set("de", filtro.de);
  if (filtro.ate) parametros.set("ate", filtro.ate);

  const resposta = await apiFetch(`${ENDPOINT}?${parametros}`, { signal, cache: "no-store" });
  if (!resposta.ok) throw new Error("Não foi possível carregar o histórico de importações.");

  return lerLista(await resposta.json());
}
