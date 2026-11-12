import { apiFetch } from "../../../shared/api/apiFetch.ts";
import type {
  PaginaHistoricoViagens,
  StatusHistoricoViagem,
  ViagemHistorico,
} from "../model/types";

const ENDPOINT = "/api/operacional/motoristas";

const STATUS_HISTORICO: readonly StatusHistoricoViagem[] = [
  "EM_ANDAMENTO",
  "CONCLUIDA",
];

interface ViagemHistoricoResposta {
  id: number;
  manifesto: string;
  origem?: string | null;
  destino?: string | null;
  dataSaida: string;
  previsaoChegada?: string | null;
  status: StatusHistoricoViagem;
}

interface PaginaHistoricoResposta {
  viagens: ViagemHistoricoResposta[];
  pagina: number;
  tamanho: number;
  totalViagens: number;
  totalPaginas: number;
  ultimaPagina: boolean;
}

function textoOuNulo(valor: unknown): string | null {
  return typeof valor === "string" && valor.trim() !== "" ? valor : null;
}

function ehViagemValida(item: unknown): item is ViagemHistoricoResposta {
  if (item === null || typeof item !== "object") return false;

  const viagem = item as Partial<Record<keyof ViagemHistoricoResposta, unknown>>;

  return (
    typeof viagem.id === "number" &&
    typeof viagem.manifesto === "string" &&
    typeof viagem.dataSaida === "string" &&
    STATUS_HISTORICO.includes(viagem.status as StatusHistoricoViagem)
  );
}

function ehPaginaValida(dados: unknown): dados is PaginaHistoricoResposta {
  if (dados === null || typeof dados !== "object") return false;

  const pagina = dados as Partial<Record<keyof PaginaHistoricoResposta, unknown>>;

  return (
    Array.isArray(pagina.viagens) &&
    pagina.viagens.every(ehViagemValida) &&
    typeof pagina.pagina === "number" &&
    typeof pagina.tamanho === "number" &&
    typeof pagina.totalViagens === "number" &&
    typeof pagina.totalPaginas === "number" &&
    typeof pagina.ultimaPagina === "boolean"
  );
}

function mapearViagem(viagem: ViagemHistoricoResposta): ViagemHistorico {
  return {
    id: viagem.id,
    manifesto: viagem.manifesto,
    origem: textoOuNulo(viagem.origem),
    destino: textoOuNulo(viagem.destino),
    dataSaida: viagem.dataSaida,
    previsaoChegada: textoOuNulo(viagem.previsaoChegada),
    status: viagem.status,
  };
}

export async function buscarHistoricoViagens(
  motoristaId: number,
  pagina: number,
  tamanho: number,
  signal?: AbortSignal,
): Promise<PaginaHistoricoViagens> {
  const parametros = new URLSearchParams({
    pagina: String(pagina),
    tamanho: String(tamanho),
  });
  const resposta = await apiFetch(
    `${ENDPOINT}/${motoristaId}/viagens?${parametros}`,
    { signal, cache: "no-store" },
  );

  if (resposta.status === 404) {
    throw new Error("Motorista não encontrado.");
  }

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar o histórico de viagens.");
  }

  const dados: unknown = await resposta.json().catch(() => null);

  if (!ehPaginaValida(dados)) {
    throw new Error("A resposta do serviço está inválida.");
  }

  return {
    viagens: dados.viagens.map(mapearViagem),
    pagina: dados.pagina,
    tamanho: dados.tamanho,
    totalViagens: dados.totalViagens,
    totalPaginas: dados.totalPaginas,
    ultimaPagina: dados.ultimaPagina,
  };
}
