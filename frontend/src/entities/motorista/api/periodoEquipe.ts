/**
 * Janela de dados da tela de equipe: últimos 12 meses.
 *
 * A mesma janela alimenta a coluna Viagens (GET /motoristas) e a Frequência
 * (indicador de utilização), para não zerar a tela quando o mês corrente ainda
 * não tem viagens — no banco atual todo o dado é de jul/ago/2026.
 */
export const JANELA_EQUIPE_MESES = 12;

export function periodoEquipe(hoje = new Date()): {
  dataInicio: string;
  dataFim: string;
} {
  const doisDigitos = (valor: number) => String(valor).padStart(2, "0");
  const formatar = (data: Date) =>
    `${doisDigitos(data.getDate())}/${doisDigitos(data.getMonth() + 1)}/${data.getFullYear()}`;

  const inicio = new Date(
    hoje.getFullYear(),
    hoje.getMonth() - (JANELA_EQUIPE_MESES - 1),
    1,
  );

  return { dataInicio: formatar(inicio), dataFim: formatar(hoje) };
}
