import { apiFetch } from "../../../shared/api/apiFetch.ts";
import type { AlertaUtilizacao } from "../model/types";

const ENDPOINT = "/api/operacional/motoristas/baixa-utilizacao";

interface MotoristaBaixaUtilizacaoResponse {
  chave: string;
  motoristaId: number | null;
  nome: string;
  porcentagem: number;
}

function ehMotoristaValido(
  item: unknown,
): item is MotoristaBaixaUtilizacaoResponse {
  if (item === null || typeof item !== "object") return false;

  const motorista = item as Partial<MotoristaBaixaUtilizacaoResponse>;

  return (
    typeof motorista.chave === "string" &&
    typeof motorista.nome === "string" &&
    typeof motorista.porcentagem === "number"
  );
}

export async function buscarAlertasUtilizacao(
  signal?: AbortSignal,
  dataInicio?: string,
  dataFim?: string,
): Promise<AlertaUtilizacao[]> {
  const parametros = new URLSearchParams();
  if (dataInicio && dataFim) {
    parametros.set("dataInicio", dataInicio);
    parametros.set("dataFim", dataFim);
  }
  const queryString = parametros.toString();
  const query = queryString ? `?${queryString}` : "";
  const resposta = await apiFetch(`${ENDPOINT}${query}`, { signal });

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar os alertas de utilização.");
  }

  const dados: unknown = await resposta.json();

  if (!Array.isArray(dados) || !dados.every(ehMotoristaValido)) {
    throw new Error("A resposta do serviço está inválida.");
  }

  return dados.map((motorista) => ({
    id: motorista.motoristaId ?? motorista.chave,
    nome: motorista.nome,
    percentual: motorista.porcentagem,
  }));
}
