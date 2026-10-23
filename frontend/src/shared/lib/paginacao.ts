export const RETICENCIAS = "...";

export type ItemPaginacao = number | typeof RETICENCIAS;

/**
 * Páginas exibidas no paginador: a primeira, até `vizinhas` antes e depois da
 * atual e a última, com reticências onde houver salto.
 *
 * Ex.: atual 10 de 40 -> [1, "...", 7, 8, 9, 10, 11, 12, 13, "...", 40].
 */
export function paginasVisiveis(
  atual: number,
  total: number,
  vizinhas = 3,
): ItemPaginacao[] {
  if (total <= 0) return [];

  const inicio = Math.max(2, atual - vizinhas);
  const fim = Math.min(total - 1, atual + vizinhas);
  const itens: ItemPaginacao[] = [1];

  if (inicio > 2) itens.push(RETICENCIAS);
  for (let pagina = inicio; pagina <= fim; pagina += 1) itens.push(pagina);
  if (fim < total - 1) itens.push(RETICENCIAS);
  if (total > 1) itens.push(total);

  return itens;
}

export function totalDePaginas(totalItens: number, porPagina: number): number {
  return Math.max(1, Math.ceil(totalItens / porPagina));
}
