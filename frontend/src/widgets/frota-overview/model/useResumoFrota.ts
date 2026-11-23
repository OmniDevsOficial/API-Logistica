import { useEffect, useState } from "react";
import { buscarResumoFrota, type PeriodoFrota, type ResumoFrota } from "@entities/veiculo";

export function useResumoFrota({ dataInicio, dataFim }: PeriodoFrota, versao: number) {
  const [dados, setDados] = useState<ResumoFrota | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function carregar() {
      setCarregando(true);
      setErro(null);

      try {
        setDados(await buscarResumoFrota({ dataInicio, dataFim }, controller.signal));
      } catch (erroCarregamento) {
        if (controller.signal.aborted) return;
        setErro(
          erroCarregamento instanceof Error
            ? erroCarregamento.message
            : "Não foi possível carregar o resumo dos veículos.",
        );
        setDados(null);
      } finally {
        if (!controller.signal.aborted) setCarregando(false);
      }
    }

    void carregar();
    return () => controller.abort();
  }, [dataInicio, dataFim, versao]);

  return { dados, carregando, erro };
}
