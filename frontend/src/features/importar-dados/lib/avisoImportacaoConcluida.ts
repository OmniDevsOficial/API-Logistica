import type { TipoPlanilha } from "@shared/lib";

/** Nome do evento disparado quando um modal de importação termina. */
export const EVENTO_IMPORTACAO_CONCLUIDA = "importacao:concluida";

/**
 * Avisa que uma importação de manifesto ou de veículos terminou. A tela de
 * Registros escuta este evento e recarrega o histórico, sem precisar de um
 * estado global.
 */
export function avisarImportacaoConcluida(tipo: TipoPlanilha): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(EVENTO_IMPORTACAO_CONCLUIDA, { detail: { tipo } }),
  );
}
