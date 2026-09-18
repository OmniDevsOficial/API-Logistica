import { useState } from 'react';
import { filtrarViagensApi } from '../api/filtrarViagens';
import type { EstadoFiltro } from '../model/types';

// Centraliza o estado e a lógica do filtro por destino.
// atualizar a lista/gráfico sem esse hook precisar saber quem é o consumidor.
export function useFiltroDestino(onFiltroAplicado?: (resultado: any[]) => void) {
  const [estado, setEstado] = useState<EstadoFiltro>({
    filtroAtivo: null,
    carregando: false,
    erro: null,
    resultados: [],
  });

  const aplicarFiltro = async (destino: string) => {
    setEstado(prev => ({ ...prev, carregando: true, erro: null }));

    try {
      const dados = await filtrarViagensApi(destino);

      // Critério de aceite: endpoint vazio precisa virar mensagem, não lista vazia silenciosa
      if (!dados || dados.length === 0) {
        setEstado(prev => ({
          ...prev,
          erro: 'Nenhuma viagem encontrada para esse destino',
          filtroAtivo: null,
          resultados: [],
          carregando: false,
        }));
      } else {
        setEstado(prev => ({
          ...prev,
          filtroAtivo: { destino },
          resultados: dados,
          carregando: false,
        }));
        onFiltroAplicado?.(dados);
      }
    } catch (e) {
      setEstado(prev => ({
        ...prev,
        erro: 'Erro ao filtrar viagens. Tente novamente.',
        carregando: false,
      }));
    }
  };

  const limparFiltro = () => {
    setEstado({ filtroAtivo: null, carregando: false, erro: null, resultados: [] });
  };

  return {
    filtroAtivo: estado.filtroAtivo,
    carregando: estado.carregando,
    erro: estado.erro,
    resultados: estado.resultados,
    aplicarFiltro,
    limparFiltro,
  };
}