// Hook que concentra todo o estado do filtro: valores selecionados, chamada
// à API, loading e erro.

import { useState } from "react";
import { filtrarViagensApi } from "../api/filtrarViagens";
import { filtroVazio, type FiltroViagens } from "./types";

export function useFiltroViagens(
  onFiltroAplicado?: (resultado: any[]) => void,
) {
  const [filtro, setFiltro] = useState<FiltroViagens>(filtroVazio);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Conta quantos critérios estão preenchidos, só pra mostrar o valor no
  // botão (ex: "Filtrar (2)"). apenasDisponiveis é boolean então trata à parte.
  const quantidadeAtiva = Object.entries(filtro).filter(([chave, valor]) => {
    if (chave === 'destino' || chave === 'mes') return valor !== '';
    if (chave === 'status') return (valor as any[]).length > 0;
    return valor !== null;
  }).length;

  // Aplica os filtros escolhidos no dropdown
  const aplicar = async () => {
    setCarregando(true);
    setErro(null);

    try {
      const dados = await filtrarViagensApi(filtro);

      // Resposta vazia vira mensagem, ao invés de listar em branco
      if (!dados || dados.length === 0) {
        setErro("Viagem não encontrada para estes filtros");
      } else {
        onFiltroAplicado?.(dados);
      }
    } catch {
      setErro("Erro ao filtrar viagens. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  // Função de limpar o filtro
  const limpar = (onLimpo?: () => void) => {
    setFiltro(filtroVazio);
    setErro(null);
    onLimpo?.();
  };

  return {
    filtro,
    setFiltro,
    carregando,
    erro,
    quantidadeAtiva,
    aplicar,
    limpar,
  };
}
