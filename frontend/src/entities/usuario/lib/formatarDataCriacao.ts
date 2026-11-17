const FORMATADOR = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function formatarDataCriacao(criadoEm: string): string {
  const data = new Date(criadoEm);
  return Number.isNaN(data.getTime()) ? "—" : FORMATADOR.format(data);
}
