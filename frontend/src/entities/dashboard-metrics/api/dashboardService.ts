import { apiFetch } from "../../../shared/api/apiFetch.ts";
import type {
  DashboardData,
  DashboardMetrics,
  DashboardStatus,
  DestinoMaisRentavel,
  RentabilidadeTipoVeiculo,
  SerieRentabilidade,
  ViagensPorStatus,
} from "../model/types";

const ENDPOINT = "/api/operacional/dashboard";
const ENDPOINT_RENTABILIDADE_POR_TIPO = `${ENDPOINT}/rentabilidade-por-tipo`;
const TIPO_NAO_IDENTIFICADO = "NAO_IDENTIFICADO";
const FALHA_RENTABILIDADE_POR_TIPO =
  "Não foi possível carregar a rentabilidade por tipo de veículo.";
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

function mapearDestinoMaisRentavel(dados: unknown): DestinoMaisRentavel | null {
  if (dados === null || dados === undefined) {
    return null;
  }

  const destino = registro(dados);

  return {
    destino: texto(destino.destino),
    viagens: numero(destino.viagens),
    rentabilidadeTotal: numero(destino.rentabilidadeTotal),
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
    viagensPorMotorista: numeroOuNulo(metricas.viagensPorMotorista),
    veiculosUtilizados: numero(metricas.veiculosUtilizados),
    viagensPorStatus: mapearViagensPorStatus(metricas.viagensPorStatus),
    custoTotal: numeroOuNulo(metricas.custoTotal),
    custoMedio: numeroOuNulo(metricas.custoMedio),
    rentabilidadeTotal: numeroOuNulo(metricas.rentabilidadeTotal),
    rentabilidadeMedia: numeroOuNulo(metricas.rentabilidadeMedia),
    margem: numeroOuNulo(metricas.margem),
    destinoMaisRentavel: mapearDestinoMaisRentavel(metricas.destinoMaisRentavel),
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
    serieRentabilidade: mapearSerieRentabilidade(resposta.series),
  };
}

function mapearSerieRentabilidade(dados: unknown): SerieRentabilidade {
  const serie = registro(registro(dados).rentabilidadePorPeriodo);

  if (!Array.isArray(serie.pontos)) {
    throw new Error(RESPOSTA_INVALIDA);
  }

  return {
    agrupamento: texto(serie.agrupamento) === "DIA" ? "DIA" : "MES",
    pontos: serie.pontos.map((item) => {
      const ponto = registro(item);
      return {
        rotulo: texto(ponto.rotulo),
        viagens: numero(ponto.viagens),
        custo: numero(ponto.custo),
        rentabilidade: numero(ponto.rentabilidade),
      };
    }),
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

function mapearTipoVeiculo(dados: unknown): RentabilidadeTipoVeiculo {
  const item = registro(dados);
  const tipo = texto(item.tipo);

  return {
    tipo,
    naoIdentificado: tipo === TIPO_NAO_IDENTIFICADO,
    viagens: numero(item.viagens),
    receita: numero(item.receita),
    custo: numero(item.custo),
    rentabilidade: numero(item.rentabilidade),
    mediaPorViagem: numeroOuNulo(item.mediaPorViagem),
  };
}

export async function getRentabilidadePorTipo(
  mes: string,
  signal?: AbortSignal,
): Promise<RentabilidadeTipoVeiculo[]> {
  const parametros = new URLSearchParams({ mes });
  const resposta = await consultar(
    `${ENDPOINT_RENTABILIDADE_POR_TIPO}?${parametros.toString()}`,
    signal,
  );

  if (!resposta.ok) {
    throw new Error(FALHA_RENTABILIDADE_POR_TIPO);
  }

  const dados: unknown = await resposta.json();
  if (!Array.isArray(dados)) {
    throw new Error(RESPOSTA_INVALIDA);
  }

  return dados.map(mapearTipoVeiculo);
}
