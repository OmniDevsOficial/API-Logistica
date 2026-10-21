const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const PASSOS_DO_TETO = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];

type Agrupamento = "DIA" | "MES";

export function nomeDoMes(rotulo: string): string {
  const [mes, ano] = rotulo.split("/");
  return `${MESES[Number(mes) - 1] ?? mes}/${ano}`;
}

export function rotuloDoTooltip(rotulo: string, agrupamento: Agrupamento): string {
  return agrupamento === "DIA" ? rotulo : nomeDoMes(rotulo);
}

export function rotuloDoEixo(rotulo: string, agrupamento: Agrupamento): string {
  return agrupamento === "DIA" ? rotulo.slice(0, 2) : nomeDoMes(rotulo).slice(0, 3);
}

export function tetoArredondado(maximo: number): number {
  if (maximo <= 0) return 1;
  const ordem = 10 ** Math.floor(Math.log10(maximo));
  const passo = PASSOS_DO_TETO.find((fator) => fator * ordem >= maximo) ?? 10;
  return passo * ordem;
}

export function marcacoes(maximo: number, inteiras: boolean): number[] {
  const teto = tetoArredondado(maximo);
  const meio = teto / 2;
  return inteiras && !Number.isInteger(meio) ? [0, teto] : [0, meio, teto];
}
