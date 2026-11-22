import { useEffect, useState } from "react";
import { buscarFrota, type FiltroFrota, type PaginaFrota } from "@entities/veiculo";

export function useFrota(
  { pagina, tamanho, tipo, busca, dataInicio, dataFim }: FiltroFrota,
  versao: number,
) {
  const [dados, setDados] = useState<PaginaFrota | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function carregar() {
      setCarregando(true);
      setErro(null);

      try {
        setDados(await buscarFrota(
            { pagina, tamanho, tipo, busca, dataInicio, dataFim },
            controller.signal,
          ));
      } catch (erroCarregamento) {
        if (controller.signal.aborted) return;
        setErro(
          erroCarregamento instanceof Error
            ? erroCarregamento.message
            : "Não foi possível carregar os veículos.",
        );
        setDados(null);
      } finally {
        if (!controller.signal.aborted) setCarregando(false);
      }
    }

    void carregar();
    return () => controller.abort();
  }, [pagina, tamanho, tipo, busca, dataInicio, dataFim, versao]);

  return { dados, carregando, erro };
}
