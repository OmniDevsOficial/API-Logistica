import type { ImportacaoHistorico } from "@entities/importacao";

/** Remove acentos e caixa para a busca não depender de como o nome foi salvo. */
export function normalizarBusca(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Busca pelo nome do arquivo, feita no cliente sobre a lista já baixada: o
 * back entrega o histórico inteiro da origem e o nome não vira parâmetro.
 */
export function filtrarPorArquivo(
  linhas: ImportacaoHistorico[],
  busca: string,
): ImportacaoHistorico[] {
  const termo = normalizarBusca(busca);
  if (!termo) return linhas;
  return linhas.filter((linha) => normalizarBusca(linha.arquivo).includes(termo));
}
