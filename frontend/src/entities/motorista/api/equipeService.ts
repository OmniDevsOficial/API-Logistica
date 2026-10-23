import { buscarMotoristas } from "./motoristaListaService.ts";
import { buscarResumoMotoristas } from "./motoristaResumoService.ts";
import { periodoEquipe } from "./periodoEquipe.ts";
import { buscarUtilizacaoMotoristas } from "./utilizacaoService.ts";
import type {
  EquipeMotoristasData,
  MotoristaEquipe,
  StatusEquipe,
} from "../model/types";

function chaveCpf(cpf: string | null): string | null {
  if (!cpf) return null;

  const digitos = cpf.replace(/\D/g, "");
  return digitos.length === 11 ? digitos : null;
}

/**
 * Frequência vem do indicador de utilização (participação nas viagens),
 * consultado nos últimos 12 meses para não zerar a tela.
 * A falha dessa chamada não derruba a tela: os motoristas ficam sem percentual.
 */
async function carregarFrequencias(
  signal?: AbortSignal,
): Promise<Map<string, number>> {
  try {
    const { dataInicio, dataFim } = periodoEquipe();
    const utilizacao = await buscarUtilizacaoMotoristas(
      dataInicio,
      dataFim,
      "desc",
      signal,
    );

    const frequencias = new Map<string, number>();
    for (const motorista of utilizacao) {
      const percentual = motorista.percentualUtilizacao ?? 0;

      if (typeof motorista.id === "number") {
        frequencias.set(`id:${motorista.id}`, percentual);
      } else {
        frequencias.set(`cpf:${String(motorista.id).replace(/\D/g, "")}`, percentual);
      }
    }

    return frequencias;
  } catch (erroFrequencia) {
    if (signal?.aborted) throw erroFrequencia;
    return new Map();
  }
}

function comFrequencia(
  motoristas: MotoristaEquipe[],
  frequencias: Map<string, number>,
): MotoristaEquipe[] {
  return motoristas.map((motorista) => {
    const cpf = chaveCpf(motorista.cpf);
    const percentual =
      frequencias.get(`id:${motorista.id}`) ??
      (cpf ? frequencias.get(`cpf:${cpf}`) : undefined);

    return { ...motorista, frequencia: percentual ?? null };
  });
}

export async function buscarEquipeMotoristas(
  filtro?: StatusEquipe | null,
  signal?: AbortSignal,
): Promise<EquipeMotoristasData> {
  try {
    const [resumo, motoristas, frequencias] = await Promise.all([
      buscarResumoMotoristas(signal),
      buscarMotoristas(filtro, signal),
      carregarFrequencias(signal),
    ]);

    return {
      totalMotoristas: resumo.total,
      disponiveis: resumo.disponiveis,
      emViagem: resumo.emOperacao,
      indisponiveis: resumo.indisponiveis,
      motoristas: comFrequencia(motoristas, frequencias),
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
