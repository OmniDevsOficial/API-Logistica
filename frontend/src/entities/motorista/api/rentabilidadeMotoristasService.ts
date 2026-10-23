import { apiFetch } from "../../../shared/api/apiFetch.ts";

const ENDPOINT = "/api/operacional/viagens/rentabilidade/motoristas";

export interface RentabilidadeMotorista {
  motorista: string;
  rentabilidadeMedia: number | null;
  quantidadeViagensConsideradas: number;
}

function validarItem(item: unknown): item is RentabilidadeMotorista {
  if (item === null || typeof item !== "object") return false;
  const registro = item as Partial<RentabilidadeMotorista>;
  return (
    typeof registro.motorista === "string" &&
    (typeof registro.rentabilidadeMedia === "number" ||
      typeof registro.rentabilidadeMedia === "string" ||
      registro.rentabilidadeMedia === null) &&
    typeof registro.quantidadeViagensConsideradas === "number"
  );
}

export async function buscarRentabilidadeMotoristas(
  dataInicio: string,
  dataFim: string,
  signal?: AbortSignal,
): Promise<RentabilidadeMotorista[]> {
  const parametros = new URLSearchParams({ dataInicio, dataFim });
  const resposta = await apiFetch(`${ENDPOINT}?${parametros}`, { signal });

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar a rentabilidade dos motoristas.");
  }

  const dados: unknown = await resposta.json();
  if (!Array.isArray(dados) || !dados.every(validarItem)) {
    throw new Error("A resposta de rentabilidade está inválida.");
  }

  return dados.map((item) => ({
    ...item,
    rentabilidadeMedia:
      item.rentabilidadeMedia === null
        ? null
        : Number(item.rentabilidadeMedia),
  }));
}
