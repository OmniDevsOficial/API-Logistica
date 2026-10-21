import { buscarMotoristas } from "./motoristaListaService.ts";
import { buscarResumoMotoristas } from "./motoristaResumoService.ts";
import type { EquipeMotoristasData, StatusEquipe } from "../model/types";

export async function buscarEquipeMotoristas(
  filtro?: StatusEquipe | null,
  signal?: AbortSignal,
): Promise<EquipeMotoristasData> {
  try {
    const [resumo, motoristas] = await Promise.all([
      buscarResumoMotoristas(signal),
      buscarMotoristas(filtro, signal),
    ]);

    return {
      totalMotoristas: resumo.total,
      disponiveis: resumo.disponiveis,
      emViagem: resumo.emOperacao,
      indisponiveis: resumo.indisponiveis,
      motoristas,
    };
  } catch (erro) {
    if (signal?.aborted) {
      throw erro;
    }

    throw new Error("Não foi possível carregar a equipe de motoristas.", {
      cause: erro,
    });
  }
}
