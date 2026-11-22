import { useEffect, useState } from "react";
import type { PeriodOption } from "@entities/dashboard-metrics";
import { buscarDataMaisRecente } from "@entities/viagem";
import { referenciaDaDataIso } from "../lib/intervaloDoPeriodo";
import { lerFiltroSalvo, salvarFiltro } from "../lib/filtroSalvo";

export interface PeriodoSalvo {
  periodo: PeriodOption;
  setPeriodo: (periodo: PeriodOption) => void;
  referencia: Date;
  setReferencia: (referencia: Date) => void;
  pronto: boolean;
}

export function usePeriodoSalvo(tela: string): PeriodoSalvo {
  const [salvo] = useState(() => lerFiltroSalvo(tela));
  const [periodo, setPeriodo] = useState<PeriodOption>(salvo?.periodo ?? "mes");
  const [referencia, setReferencia] = useState<Date>(() => salvo?.referencia ?? new Date());
  const [pronto, setPronto] = useState(salvo !== null);

  useEffect(() => {
    if (salvo) return;
    const controller = new AbortController();

    buscarDataMaisRecente(controller.signal)
      .then((dataIso) => {
        const maisRecente = dataIso ? referenciaDaDataIso(dataIso) : null;
        if (maisRecente) setReferencia(maisRecente);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!controller.signal.aborted) setPronto(true);
      });

    return () => controller.abort();
  }, [salvo]);

  useEffect(() => {
    if (pronto) salvarFiltro(tela, { periodo, referencia });
  }, [tela, pronto, periodo, referencia]);

  return { periodo, setPeriodo, referencia, setReferencia, pronto };
}
