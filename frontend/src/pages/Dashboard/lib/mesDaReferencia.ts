const NOME_DO_MES = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
});

export function mesDaReferencia(referencia: Date): string {
  const mes = String(referencia.getMonth() + 1).padStart(2, "0");
  return `${referencia.getFullYear()}-${mes}`;
}

export function rotuloDoMes(referencia: Date): string {
  const rotulo = NOME_DO_MES.format(referencia);
  return rotulo.charAt(0).toLocaleUpperCase("pt-BR") + rotulo.slice(1);
}
