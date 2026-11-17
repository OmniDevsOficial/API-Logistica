import type { ImportacaoHistorico } from "@entities/importacao";

/**
 * Junta as importações dos dois serviços em uma única lista, da mais recente
 * para a mais antiga. As listas chegam separadas justamente para que a falha
 * de uma não esconda a outra; aqui elas só se encontram.
 */
export function juntarImportacoes(
  manifesto: ImportacaoHistorico[],
  veiculos: ImportacaoHistorico[],
): ImportacaoHistorico[] {
  return [...manifesto, ...veiculos].sort(
    (a, b) => b.dataHora.getTime() - a.dataHora.getTime(),
  );
}
