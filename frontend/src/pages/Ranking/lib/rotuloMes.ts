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

/** Mês de referência no formato AAAA-MM, como o backend espera em `?mes=`. */
export function mesDaReferencia(referencia: Date): string {
  const mes = String(referencia.getMonth() + 1).padStart(2, "0");
  return `${referencia.getFullYear()}-${mes}`;
}
