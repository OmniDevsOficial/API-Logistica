/**
 * Janela da consulta de Frequência: últimos 12 meses.
 *
 * A Frequência vem do indicador de utilização (participação nas viagens do
 * período); consultar só o mês corrente zera todo mundo quando o mês ainda não
 * tem viagens (ex.: dado de jul/ago consultado em outubro).
 *
 * A coluna Viagens não entra aqui: o back já devolve o total de viagens do
 * motorista, sem filtro de período.
 */
export const JANELA_FREQUENCIA_MESES = 12;

export function periodoEquipe(hoje = new Date()): {
  dataInicio: string;
  dataFim: string;
} {
  const doisDigitos = (valor: number) => String(valor).padStart(2, "0");
  const formatar = (data: Date) =>
    `${doisDigitos(data.getDate())}/${doisDigitos(data.getMonth() + 1)}/${data.getFullYear()}`;

  const inicio = new Date(
    hoje.getFullYear(),
    hoje.getMonth() - (JANELA_FREQUENCIA_MESES - 1),
    1,
  );

  return { dataInicio: formatar(inicio), dataFim: formatar(hoje) };
}
