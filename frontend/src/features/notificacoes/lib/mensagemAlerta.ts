import type { AlertaUtilizacao } from "@entities/motorista";
import { formatFrequencia } from "../../../shared/lib/format.ts";

export function mensagemAlerta({ nome, percentual }: AlertaUtilizacao): string {
  return `Alerta motorista: ${nome}, baixa frequência: ${formatFrequencia(percentual)}`;
}
