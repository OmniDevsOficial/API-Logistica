import { useEffect, useState } from "react";
import { getRankingDestinos, type RankingDestino } from "@entities/viagem";

interface ResultadoRanking {
  chave: string;
  ranking: RankingDestino[];
  erro: string | null;
}

/** Busca o TOP 10 de rotas do período (datas em dd/MM/aaaa). */
export function useRankingDestinos(dataInicio: string, dataFim: string) {
  const [resultado, setResultado] = useState<ResultadoRanking | null>(null);
  const chave = `${dataInicio}-${dataFim}`;

  useEffect(() => {
    const controller = new AbortController();
    const chaveConsulta = `${dataInicio}-${dataFim}`;

    async function carregar() {
      try {
        const ranking = await getRankingDestinos(dataInicio, dataFim, controller.signal);
        setResultado({ chave: chaveConsulta, ranking, erro: null });
      } catch (erroCarregamento) {
        if (controller.signal.aborted) return;
        setResultado({
          chave: chaveConsulta,
          ranking: [],
          erro:
            erroCarregamento instanceof Error
              ? erroCarregamento.message
              : "Ocorreu um erro ao carregar o ranking.",
        });
      }
    }

    void carregar();
    return () => controller.abort();
  }, [dataInicio, dataFim]);

  // Resultado de outro período ainda é a resposta anterior: trata como carregando.
  const atual = resultado?.chave === chave ? resultado : null;

  return {
    ranking: atual?.ranking ?? [],
    carregando: atual === null,
    erro: atual?.erro ?? null,
  };
}
