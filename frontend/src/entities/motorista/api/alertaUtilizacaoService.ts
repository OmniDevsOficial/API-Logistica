import { periodoEquipe } from "./periodoEquipe.ts";
import { buscarUtilizacaoMotoristas } from "./utilizacaoService.ts";
import type { AlertaUtilizacao } from "../model/types";

export async function buscarAlertasUtilizacao(
  signal?: AbortSignal,
): Promise<AlertaUtilizacao[]> {
  const { dataInicio, dataFim } = periodoEquipe();
  const motoristas = await buscarUtilizacaoMotoristas(
    dataInicio,
    dataFim,
    "asc",
    signal,
  );

  return motoristas
    .filter((motorista) => motorista.baixaUtilizacao)
    .map((motorista) => ({
      id: motorista.id,
      nome: motorista.nome,
      percentual: motorista.percentualUtilizacao ?? 0,
    }));
}
