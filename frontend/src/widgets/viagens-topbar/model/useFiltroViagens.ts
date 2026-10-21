// Hook que concentra todo o estado do filtro: valores selecionados, chamada
// à API, loading e erro.

import { useEffect, useState } from "react";
import { filtrarViagensApi } from "../api/filtrarViagens";
import { filtroVazio, type FiltroViagens } from "./types";

export function useFiltroViagens(
  onFiltroAplicado?: (resultado: any[]) => void,
  filtroInicial: FiltroViagens = filtroVazio,
) {
  const [filtro, setFiltro] = useState<FiltroViagens>(() => ({
    ...filtroInicial,
    status: [...filtroInicial.status],
  }));
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    setFiltro(filtroInicial);
  }, [filtroInicial]);

  const aplicar = async () => {
    setCarregando(true);
    setErro(null);

    try {
      const dados = await filtrarViagensApi(filtro);

      if (!dados || dados.length === 0) {
        setErro("Nenhuma viagem encontrada para esses filtros");
      } else {
        onFiltroAplicado?.(dados);
      }
    } catch {
      setErro("Erro ao filtrar viagens. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  const limpar = (onLimpo?: () => void) => {
    setFiltro(filtroVazio);
    setErro(null);
    onLimpo?.();
  };

  return { filtro, setFiltro, carregando, erro, aplicar, limpar };
}
