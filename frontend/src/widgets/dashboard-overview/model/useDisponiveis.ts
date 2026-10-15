import { useEffect, useState } from "react";
import { buscarResumoMotoristas } from "@entities/motorista";

export function useDisponiveis(period: string): number | null {
  const [disponiveis, setDisponiveis] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function carregar() {
      setDisponiveis(null);

      try {
        const resumo = await buscarResumoMotoristas(controller.signal);
        if (!controller.signal.aborted) setDisponiveis(resumo.disponiveis);
      } catch {
        if (!controller.signal.aborted) setDisponiveis(null);
      }
    }

    void carregar();
    return () => controller.abort();
  }, [period]);

  return disponiveis;
}
