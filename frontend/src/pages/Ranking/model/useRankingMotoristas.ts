import { useCallback, useEffect, useState } from "react";
import { buscarRankingMotoristas } from "@entities/motorista";
import type { FiltroRanking, RankingMotorista } from "@entities/motorista";

/**
 * Ranking do período consultado. Trocar o período (ou pedir um recarregamento)
 * dispara uma nova chamada, abortando a anterior.
 */
export function useRankingMotoristas(
  dataInicio: string,
  dataFim: string,
  filtro: FiltroRanking,
  tipoVeiculo?: string,
) {
  const [dados, setDados] = useState<RankingMotorista[] | null>(null);
  const [tiposDisponiveis, setTiposDisponiveis] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function carregar() {
      setCarregando(true);
      setErro(null);

      try {
        const resultado = await buscarRankingMotoristas(
          { dataInicio, dataFim },
          filtro,
          tipoVeiculo,
          controller.signal,
        );
        setDados(resultado.ranking);
        setTiposDisponiveis(resultado.tiposDisponiveis);
      } catch (erroCarregamento) {
        if (controller.signal.aborted) return;
        setErro(
          erroCarregamento instanceof Error
            ? erroCarregamento.message
            : "Ocorreu um erro ao carregar o ranking.",
        );
        setDados(null);
        setTiposDisponiveis([]);
      } finally {
        if (!controller.signal.aborted) setCarregando(false);
      }
    }

    void carregar();
    return () => controller.abort();
  }, [dataInicio, dataFim, filtro, tipoVeiculo, versao]);

  const recarregar = useCallback(() => setVersao((valor) => valor + 1), []);

  return { dados, tiposDisponiveis, carregando, erro, recarregar };
}
