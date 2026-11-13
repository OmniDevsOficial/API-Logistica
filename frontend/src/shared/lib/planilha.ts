export type TipoPlanilha = "manifesto" | "veiculos";

const BYTES_DO_CABECALHO = 8192;

function normalizarColuna(coluna: string): string {
  return coluna
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function colunasDoCabecalho(texto: string): string[] {
  const linhas = texto
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((linha) => linha.trim())
    .filter((linha) => linha !== "" && !/^sep=/i.test(linha));
  const cabecalho = linhas[0] ?? "";
  const separador = !cabecalho.includes(";") && cabecalho.includes(",") ? "," : ";";

  return cabecalho.split(separador).map(normalizarColuna).filter(Boolean);
}

export function identificarPlanilha(colunas: string[]): TipoPlanilha | null {
  if (colunas.includes("manifesto")) return "manifesto";
  if (colunas.includes("placa")) return "veiculos";
  return null;
}

export async function lerTipoDaPlanilha(arquivo: Blob): Promise<TipoPlanilha | null> {
  const inicio = await arquivo.slice(0, BYTES_DO_CABECALHO).text();
  return identificarPlanilha(colunasDoCabecalho(inicio));
}
