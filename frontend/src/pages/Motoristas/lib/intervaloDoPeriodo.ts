export function intervaloDoPeriodo(periodo: string, hoje = new Date()) {
  const dias = Number.parseInt(periodo, 10) || 30;
  const dataFim = new Date(hoje);
  const dataInicio = new Date(dataFim);
  dataInicio.setDate(dataInicio.getDate() - dias + 1);

  const formatarData = (data: Date) =>
    new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(data);

  return {
    dataInicio: formatarData(dataInicio),
    dataFim: formatarData(dataFim),
  };
}
