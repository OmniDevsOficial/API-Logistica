import { apiFetch } from "../../../shared/api/apiFetch.ts";
import { periodoEquipe } from "./periodoEquipe.ts";
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

  return {
    id: motorista.id,
    nome: motorista.nome,
    cpf: motorista.cpf ?? null,
    veiculo: motorista.tipoVeiculo ?? "-",
    placa: motorista.placa ?? "-",
    operacao,
    dataOperacao,
    localizacao: motorista.localizacao ?? "-",
    viagens: motorista.quantidadeViagens,
    frequencia: null,
    status: STATUS_EQUIPE[motorista.status],
  };
}

export async function buscarMotoristas(
  filtro?: StatusEquipe | null,
  signal?: AbortSignal,
): Promise<MotoristaEquipe[]> {
  const parametros: string[] = [];

  if (filtro) parametros.push(`status=${STATUS_BACKEND[filtro]}`);

  // Mesma janela da Frequência: a coluna Viagens conta as viagens do período.
  const { dataInicio, dataFim } = periodoEquipe();
  parametros.push(`dataInicio=${dataInicio}`, `dataFim=${dataFim}`);

  const query = parametros.length > 0 ? `?${parametros.join("&")}` : "";
  const resposta = await apiFetch(`${ENDPOINT}${query}`, { signal });

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar os motoristas.");
  }

  const dados: unknown = await resposta.json();

  if (!validarResposta(dados)) {
    throw new Error("A resposta do serviço está inválida.");
  }

  return dados.map(mapearMotorista);
}
