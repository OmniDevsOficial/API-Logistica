import { apiFetch } from "../../../shared/api/apiFetch.ts";
import type {
  DashboardData,
  DashboardMetrics,
  DashboardStatus,
  ViagensPorStatus,
} from "../model/types";

const ENDPOINT = "/api/operacional/dashboard";
const TEMPO_LIMITE_MS = 30_000;
const RESPOSTA_INVALIDA = "A resposta do serviço está inválida.";
const FALHA_NA_CONSULTA = "Não foi possível carregar os dados do dashboard.";
const SERVICO_DEMOROU =
  "O serviço demorou a responder. Tente novamente em instantes.";
const SEM_CONEXAO =
  "Não foi possível falar com o serviço. Verifique sua conexão e tente novamente.";

function registro(valor: unknown): Record<string, unknown> {
  if (valor === null || typeof valor !== "object" || Array.isArray(valor)) {
    throw new Error(RESPOSTA_INVALIDA);
  }

  return valor as Record<string, unknown>;
}

function texto(valor: unknown): string {
  if (typeof valor !== "string" || valor.trim() === "") {
    throw new Error(RESPOSTA_INVALIDA);
  }

  return valor;
}

function numero(valor: unknown): number {
  if (typeof valor !== "number" || !Number.isFinite(valor)) {
    throw new Error(RESPOSTA_INVALIDA);
  }

  return valor;
}

function numeroOuNulo(valor: unknown): number | null {
  return valor === null || valor === undefined ? null : numero(valor);
}

function mapearStatus(valor: unknown): DashboardStatus {
  return texto(valor) === "SEM_DADOS" ? "SEM_DADOS" : "COM_DADOS";
}

function mapearViagensPorStatus(dados: unknown): ViagensPorStatus {
  const viagens = registro(dados);

  return {
    pendente: numero(viagens.pendente),
    emTransito: numero(viagens.emTransito),
    finalizado: numero(viagens.finalizado),
  };
}

function mapearMetricas(dados: unknown): DashboardMetrics {
  const metricas = registro(dados);

  return {
    totalViagens: numero(metricas.totalViagens),
    freteTotal: numeroOuNulo(metricas.freteTotal),
    freteMedio: numeroOuNulo(metricas.freteMedio),
    kmTotal: numeroOuNulo(metricas.kmTotal),
    motoristasAtivos: numero(metricas.motoristasAtivos),
    veiculosUtilizados: numero(metricas.veiculosUtilizados),
    viagensPorStatus: mapearViagensPorStatus(metricas.viagensPorStatus),
    custoTotal: numeroOuNulo(metricas.custoTotal),
    custoMedio: numeroOuNulo(metricas.custoMedio),
    rentabilidadeTotal: numeroOuNulo(metricas.rentabilidadeTotal),
    rentabilidadeMedia: numeroOuNulo(metricas.rentabilidadeMedia),
    margem: numeroOuNulo(metricas.margem),
    taxaOcupacao: numeroOuNulo(metricas.taxaOcupacao),
  };
}

function mapearResposta(dados: unknown): DashboardData {
  const resposta = registro(dados);

  return {
    periodo: {
      inicio: texto(resposta.dataInicio),
      fim: texto(resposta.dataFim),
    },
    status: mapearStatus(resposta.status),
    metrics: mapearMetricas(resposta.metricas),
  };
}

function sinalDaConsulta(signal?: AbortSignal): AbortSignal {
  const limite = AbortSignal.timeout(TEMPO_LIMITE_MS);
  return signal ? AbortSignal.any([signal, limite]) : limite;
}

async function consultar(url: string, signal?: AbortSignal): Promise<Response> {
  try {
    return await apiFetch(url, { signal: sinalDaConsulta(signal) });
  } catch (erro) {
    if (signal?.aborted) throw erro;
    throw new Error(
      erro instanceof Error && erro.name === "TimeoutError"
        ? SERVICO_DEMOROU
        : SEM_CONEXAO,
      { cause: erro },
    );
  }
}

export async function buscarDashboard(
  dataInicio: string,
  dataFim: string,
  signal?: AbortSignal,
): Promise<DashboardData> {
  const parametros = new URLSearchParams({ dataInicio, dataFim });
  const resposta = await consultar(
    `${ENDPOINT}?${parametros.toString()}`,
    signal,
  );

  if (!resposta.ok) {
    throw new Error(FALHA_NA_CONSULTA);
  }

  return mapearResposta(await resposta.json());
}
