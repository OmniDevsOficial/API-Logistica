const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

/**
 * Rótulo do seletor de mês do ranking, no mesmo formato do Figma
 * ("1 Setembro 2026"): sempre o primeiro dia do mês de referência.
 */
export function rotuloMes(referencia: Date): string {
  return `1 ${MESES[referencia.getMonth()]} ${referencia.getFullYear()}`;
}
