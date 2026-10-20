import { apiFetch } from "../../../shared/api/apiFetch.ts";
import type { MotoristaResumo } from "../model/types";

const ENDPOINT = "/api/operacional/motoristas/resumo";

function validarResposta(dados: unknown): dados is MotoristaResumo {
  if (dados === null || typeof dados !== "object") {
    return false;
  }

  const resumo = dados as Record<string, unknown>;

  return ["disponiveis", "emOperacao", "indisponiveis", "total"].every(
    (campo) => typeof resumo[campo] === "number",
  );
}

export async function buscarResumoMotoristas(
  signal?: AbortSignal,
): Promise<MotoristaResumo> {
  const resposta = await apiFetch(ENDPOINT, { signal });

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar os indicadores dos motoristas.");
  }

  const dados: unknown = await resposta.json();

  if (!validarResposta(dados)) {
    throw new Error("A resposta do serviço está inválida.");
  }

  return dados;
}
