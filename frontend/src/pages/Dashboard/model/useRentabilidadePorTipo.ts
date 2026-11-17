import { useCallback, useEffect, useState } from "react";
import {
  getRentabilidadePorTipo,
  type RentabilidadeTipoVeiculo,
} from "@entities/dashboard-metrics";

export function useRentabilidadePorTipo(mes: string, habilitado: boolean) {
  const [dados, setDados] = useState<RentabilidadeTipoVeiculo[] | null>(null);
  const [carregando, setCarregando] = useState(habilitado);
  const [erro, setErro] = useState<string | null>(null);
  const [atualizacoes, setAtualizacoes] = useState(0);

  useEffect(() => {
    if (!habilitado) return;

    const controller = new AbortController();

    async function carregar() {
      setCarregando(true);
      setErro(null);

      try {
        setDados(await getRentabilidadePorTipo(mes, controller.signal));
      } catch (erroCarregamento) {
        if (controller.signal.aborted) return;
        setErro(
          erroCarregamento instanceof Error
            ? erroCarregamento.message
            : "Não foi possível carregar a rentabilidade por tipo de veículo.",
        );
        setDados(null);
      } finally {
        if (!controller.signal.aborted) setCarregando(false);
      }
    }

    void carregar();
    return () => controller.abort();
  }, [mes, habilitado, atualizacoes]);

  const recarregar = useCallback(
    () => setAtualizacoes((total) => total + 1),
    [],
  );

  return { dados, carregando, erro, recarregar };
}
