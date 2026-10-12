import { useCallback, useEffect, useState } from "react";
import {
  buscarDashboard,
  type DashboardData,
  type PeriodOption,
} from "@entities/dashboard-metrics";
import { intervaloDoPeriodo } from "../lib/intervaloDoPeriodo";

export function useDashboard(periodo: PeriodOption) {
  const [dados, setDados] = useState<DashboardData | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [atualizacoes, setAtualizacoes] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function carregar() {
      setCarregando(true);
      setErro(null);

      try {
        const { dataInicio, dataFim } = intervaloDoPeriodo(periodo);
        const resultado = await buscarDashboard(
          dataInicio,
          dataFim,
          controller.signal,
        );
        setDados(resultado);
      } catch (erroCarregamento) {
        if (controller.signal.aborted) return;
        setErro(
          erroCarregamento instanceof Error
            ? erroCarregamento.message
            : "Ocorreu um erro ao carregar o dashboard.",
        );
        setDados(null);
      } finally {
        if (!controller.signal.aborted) setCarregando(false);
      }
    }

    void carregar();
    return () => controller.abort();
  }, [periodo, atualizacoes]);

  const recarregar = useCallback(
    () => setAtualizacoes((total) => total + 1),
    [],
  );

  return { dados, carregando, erro, recarregar };
}
