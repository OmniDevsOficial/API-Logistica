/**
 * Período mensal da frequência, igual ao usado pelas notificações de baixa
 * utilização. A medida conta os dias distintos em operação dentro deste mês.
 *
 * A coluna Viagens não entra aqui: o back já devolve o total de viagens do
 * motorista, sem filtro de período.
 */
export function periodoEquipe(hoje = new Date()): {
  dataInicio: string;
  dataFim: string;
} {
  const doisDigitos = (valor: number) => String(valor).padStart(2, "0");
  const formatar = (data: Date) =>
    `${doisDigitos(data.getDate())}/${doisDigitos(data.getMonth() + 1)}/${data.getFullYear()}`;

  const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

  return { dataInicio: formatar(inicio), dataFim: formatar(hoje) };
}
