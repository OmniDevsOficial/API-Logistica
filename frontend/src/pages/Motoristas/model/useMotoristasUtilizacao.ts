import { useEffect, useMemo, useState } from "react";
import { buscarUtilizacaoMotoristas } from "@entities/motorista/api/utilizacaoService";
import type { MotoristaUtilizacao } from "@entities/motorista";
import { intervaloDoPeriodo } from "../lib/intervaloDoPeriodo";

export function useMotoristasUtilizacao(
  periodo: string,
  ordem: "asc" | "desc",
) {
  const [motoristas, setMotoristas] = useState<MotoristaUtilizacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function carregar() {
      setCarregando(true);
      setErro(null);

      try {
        const { dataInicio, dataFim } = intervaloDoPeriodo(periodo);
        const resultado = await buscarUtilizacaoMotoristas(
          dataInicio,
          dataFim,
          ordem,
          controller.signal,
        );
        setMotoristas(resultado);
      } catch (erroCarregamento) {
        if (controller.signal.aborted) return;
        setErro(
          erroCarregamento instanceof Error
            ? erroCarregamento.message
            : "Ocorreu um erro ao carregar os motoristas.",
        );
        setMotoristas([]);
      } finally {
        if (!controller.signal.aborted) setCarregando(false);
      }
    }

    void carregar();
    return () => controller.abort();
  }, [periodo, ordem]);

  const motoristasOrdenados = useMemo(
    () =>
      [...motoristas].sort((a, b) => {
        if (a.percentualUtilizacao === null) return 1;
        if (b.percentualUtilizacao === null) return -1;
        return ordem === "desc"
          ? b.percentualUtilizacao - a.percentualUtilizacao
          : a.percentualUtilizacao - b.percentualUtilizacao;
      }),
    [motoristas, ordem],
  );

  return { motoristas: motoristasOrdenados, carregando, erro };
}
