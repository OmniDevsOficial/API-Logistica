import type { MotoristaUtilizacao } from "../model/types";

interface UtilizacaoMotoristaResponse {
  chave: string;
  motoristaId: number | null;
  nome: string;
  porcentagem: number;
  status: string;
}

interface UtilizacaoResponse {
  motoristas: UtilizacaoMotoristaResponse[];
}

function mapearResposta(dados: unknown): MotoristaUtilizacao[] {
  if (
    dados === null ||
    typeof dados !== "object" ||
    !("motoristas" in dados) ||
    !Array.isArray(dados.motoristas)
  ) {
    throw new Error("A resposta do serviço está inválida.");
  }

  return (dados as UtilizacaoResponse).motoristas.map((motorista) => ({
    id: motorista.motoristaId ?? motorista.chave,
    nome: motorista.nome,
    percentualUtilizacao: motorista.porcentagem,
    status: motorista.status === "SEM_VIAGENS" ? "SEM_VIAGENS" : "OK",
  }));
}

export async function buscarUtilizacaoMotoristas(
  dataInicio: string,
  dataFim: string,
  ordenacao: "asc" | "desc",
  signal?: AbortSignal,
): Promise<MotoristaUtilizacao[]> {
  const parametros = new URLSearchParams({ dataInicio, dataFim, ordenacao });
  const resposta = await fetch(
    `/api/operacional/indicadores/utilizacao?${parametros.toString()}`,
    { signal },
  );

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar os dados dos motoristas.");
  }

  return mapearResposta(await resposta.json());
}
