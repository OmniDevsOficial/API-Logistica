import { apiFetch } from "../../../shared/api/apiFetch.ts";
import { formatTipoVeiculo } from "../../../shared/lib/format.ts";
import { lerVeiculoResumo } from "../../veiculo/api/veiculoService.ts";
import type { VeiculoResumo } from "../../veiculo/model/types.ts";
import type { MotoristaEquipe, StatusEquipe } from "../model/types";

const ENDPOINT = "/api/operacional/motoristas";

const STATUS_BACKEND: Record<StatusEquipe, string> = {
  disponivel: "DISPONIVEL",
  em_viagem: "EM_OPERACAO",
  indisponivel: "INDISPONIVEL",
};

const STATUS_EQUIPE: Record<string, StatusEquipe> = {
  DISPONIVEL: "disponivel",
  EM_OPERACAO: "em_viagem",
  INDISPONIVEL: "indisponivel",
};

interface MotoristaResposta {
  id: number;
  nome: string;
  cpf?: string | null;
  tipoVeiculo: string | null;
  placa: string | null;
  status: string;
  localizacao: string | null;
  ultimaOperacao: string | null;
  previsaoDisponibilidade: string | null;
  quantidadeViagens: number;
  /** Modelo do veículo principal (ausente em versões antigas da API). */
  modeloVeiculo?: string | null;
  /** Veículos cadastrados, ativos primeiro; o primeiro é o principal. */
  veiculos?: unknown[];
}

/** Itens fora do contrato são descartados para não derrubar a tela inteira. */
function lerVeiculos(veiculos: unknown): VeiculoResumo[] {
  if (!Array.isArray(veiculos)) return [];
  return veiculos
    .map(lerVeiculoResumo)
    .filter((veiculo): veiculo is VeiculoResumo => veiculo !== null);
}

function ehMotoristaValida(item: unknown): item is MotoristaResposta {
  if (item === null || typeof item !== "object") {
    return false;
  }

  const motorista = item as Partial<MotoristaResposta>;

  return (
    typeof motorista.id === "number" &&
    typeof motorista.nome === "string" &&
    typeof motorista.quantidadeViagens === "number" &&
    typeof motorista.status === "string" &&
    motorista.status in STATUS_EQUIPE
  );
}

function validarResposta(dados: unknown): dados is MotoristaResposta[] {
  return Array.isArray(dados) && dados.every(ehMotoristaValida);
}

function formatarData(isoDate: string): string {
  const [ano, mes, dia] = isoDate.split("-");
  return `${dia}/${mes}/${ano}`;
}

function mapearOperacao(motorista: MotoristaResposta): {
  operacao: string;
  dataOperacao: string;
} {
  if (motorista.previsaoDisponibilidade) {
    return {
      operacao: "Previsão de disponibilidade",
      dataOperacao: formatarData(motorista.previsaoDisponibilidade),
    };
  }

  if (motorista.ultimaOperacao) {
    return {
      operacao: "Última operação",
      dataOperacao: formatarData(motorista.ultimaOperacao),
    };
  }

  return { operacao: "-", dataOperacao: "-" };
}

function mapearMotorista(motorista: MotoristaResposta): MotoristaEquipe {
  const { operacao, dataOperacao } = mapearOperacao(motorista);
  const veiculos = lerVeiculos(motorista.veiculos);

  return {
    id: motorista.id,
    nome: motorista.nome,
    cpf: motorista.cpf ?? null,
    veiculo: formatTipoVeiculo(motorista.tipoVeiculo) ?? "-",
    placa: motorista.placa ?? "-",
    modelo: motorista.modeloVeiculo?.trim() || null,
    outrosVeiculos: veiculos.slice(1),
    operacao,
    dataOperacao,
    localizacao: motorista.localizacao ?? "-",
    viagens: motorista.quantidadeViagens,
    frequencia: null,
    baixaFrequencia: false,
    status: STATUS_EQUIPE[motorista.status],
  };
}

export async function buscarMotoristas(
  filtro?: StatusEquipe | null,
  signal?: AbortSignal,
): Promise<MotoristaEquipe[]> {
  const query = filtro ? `?status=${STATUS_BACKEND[filtro]}` : "";
  const resposta = await apiFetch(`${ENDPOINT}${query}`, {
    signal,
    cache: "no-store",
  });

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar os motoristas.");
  }

  const dados: unknown = await resposta.json();

  if (!validarResposta(dados)) {
    throw new Error("A resposta do serviço está inválida.");
  }

  return dados.map(mapearMotorista);
}
