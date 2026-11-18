import { apiFetch } from "../../../shared/api/apiFetch.ts";
import type {
  FiltroFrota,
  PaginaFrota,
  PercentualCombustivel,
  PeriodoFrota,
  QuantidadeFrota,
  ResumoFrota,
  VeiculoFrota,
} from "../model/types.ts";

const ENDPOINT_FROTA = "/api/operacional/veiculos/frota";
const ENDPOINT_RESUMO = "/api/operacional/veiculos/resumo";
const RESPOSTA_INVALIDA = "A resposta do serviço está inválida.";

export const TIPO_NAO_IDENTIFICADO = "NAO_IDENTIFICADO";

type Objeto = Record<string, unknown>;

function ehObjeto(valor: unknown): valor is Objeto {
  return valor !== null && typeof valor === "object" && !Array.isArray(valor);
}

function textoOuNulo(valor: unknown): string | null {
  return typeof valor === "string" && valor.trim() !== "" ? valor : null;
}

function inteiro(valor: unknown): number {
  if (!Number.isInteger(valor) || (valor as number) < 0) throw new Error(RESPOSTA_INVALIDA);
  return valor as number;
}

function lerDadosAdicionais(valor: unknown): Record<string, string> {
  if (!ehObjeto(valor)) return {};
  return Object.fromEntries(
    Object.entries(valor).filter(
      (entrada): entrada is [string, string] =>
        typeof entrada[1] === "string" && entrada[1].trim() !== "",
    ),
  );
}

function lerVeiculoFrota(item: unknown): VeiculoFrota {
  if (!ehObjeto(item) || typeof item.placa !== "string" || item.placa.trim() === "") {
    throw new Error(RESPOSTA_INVALIDA);
  }
  return {
    id: inteiro(item.id),
    placa: item.placa,
    tipo: textoOuNulo(item.tipo),
    marca: textoOuNulo(item.marca),
    modelo: textoOuNulo(item.modelo),
    combustivel: textoOuNulo(item.combustivel),
    motorista: textoOuNulo(item.motorista),
    atualizadoEm: textoOuNulo(item.atualizadoEm),
    dadosAdicionais: lerDadosAdicionais(item.dadosAdicionais),
  };
}

function lerPagina(dados: unknown): PaginaFrota {
  if (!ehObjeto(dados) || !Array.isArray(dados.itens)) throw new Error(RESPOSTA_INVALIDA);
  return {
    itens: dados.itens.map(lerVeiculoFrota),
    pagina: inteiro(dados.pagina),
    tamanho: inteiro(dados.tamanho),
    totalItens: inteiro(dados.totalItens),
    totalPaginas: inteiro(dados.totalPaginas),
  };
}

function lerQuantidades(lista: unknown, campo: string): QuantidadeFrota[] {
  if (!Array.isArray(lista)) throw new Error(RESPOSTA_INVALIDA);
  return lista.map((item) => {
    if (!ehObjeto(item) || typeof item[campo] !== "string") throw new Error(RESPOSTA_INVALIDA);
    return { nome: item[campo] as string, quantidade: inteiro(item.quantidade) };
  });
}

function lerCombustiveis(lista: unknown): PercentualCombustivel[] {
  const quantidades = lerQuantidades(lista, "combustivel");
  return quantidades.map((item, indice) => {
    const percentual = (lista as Objeto[])[indice].percentual;
    if (typeof percentual !== "number" || !Number.isFinite(percentual)) {
      throw new Error(RESPOSTA_INVALIDA);
    }
    return { ...item, percentual };
  });
}

function lerResumo(dados: unknown): ResumoFrota {
  if (!ehObjeto(dados) || typeof dados.possuiDados !== "boolean") throw new Error(RESPOSTA_INVALIDA);
  return {
    possuiDados: dados.possuiDados,
    totalVeiculos: inteiro(dados.totalVeiculos),
    veiculosSemMotorista: inteiro(dados.veiculosSemMotorista),
    motoristasComVeiculo: inteiro(dados.motoristasComVeiculo),
    porTipo: lerQuantidades(dados.porTipo, "tipo"),
    porCombustivel: lerCombustiveis(dados.porCombustivel),
    porMarca: lerQuantidades(dados.porMarca, "marca"),
  };
}

function definirPeriodo(parametros: URLSearchParams, periodo: Partial<PeriodoFrota>) {
  if (periodo.dataInicio && periodo.dataFim) {
    parametros.set("dataInicio", periodo.dataInicio);
    parametros.set("dataFim", periodo.dataFim);
  }
}

export async function buscarFrota(
  filtro: FiltroFrota = {},
  signal?: AbortSignal,
): Promise<PaginaFrota> {
  const parametros = new URLSearchParams();
  parametros.set("pagina", String(filtro.pagina ?? 0));
  parametros.set("tamanho", String(filtro.tamanho ?? 20));
  if (filtro.tipo?.trim()) parametros.set("tipo", filtro.tipo.trim());
  if (filtro.busca?.trim()) parametros.set("busca", filtro.busca.trim());
  definirPeriodo(parametros, filtro);

  const resposta = await apiFetch(`${ENDPOINT_FROTA}?${parametros}`, { signal, cache: "no-store" });
  if (!resposta.ok) throw new Error("Não foi possível carregar os veículos.");

  return lerPagina(await resposta.json());
}

export async function buscarResumoFrota(
  periodo?: PeriodoFrota | null,
  signal?: AbortSignal,
): Promise<ResumoFrota> {
  const parametros = new URLSearchParams();
  definirPeriodo(parametros, periodo ?? {});
  const query = parametros.size > 0 ? `?${parametros}` : "";

  const resposta = await apiFetch(`${ENDPOINT_RESUMO}${query}`, { signal, cache: "no-store" });
  if (!resposta.ok) throw new Error("Não foi possível carregar o resumo dos veículos.");

  return lerResumo(await resposta.json());
}
