import { apiFetch } from "../../../shared/api/apiFetch.ts";
import type { StatusEquipe } from "../model/types";

const STATUS_BACKEND: Record<StatusEquipe, string> = {
  disponivel: "DISPONIVEL",
  em_viagem: "EM_OPERACAO",
  indisponivel: "INDISPONIVEL",
};

export async function atualizarStatusMotorista(
  id: number,
  status: StatusEquipe,
  signal?: AbortSignal,
): Promise<void> {
  const resposta = await apiFetch(`/api/operacional/motoristas/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: STATUS_BACKEND[status] }),
    signal,
  });

  if (!resposta.ok) {
    throw new Error("Não foi possível atualizar o status do motorista.");
  }
}
