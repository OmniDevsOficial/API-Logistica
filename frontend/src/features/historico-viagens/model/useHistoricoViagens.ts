import { useCallback, useEffect, useRef, useState } from "react";
import { buscarHistoricoViagens } from "@entities/viagem";
import type { ViagemHistorico } from "@entities/viagem";
import { mesclarViagens } from "../lib/mesclarViagens";

const TAMANHO_PAGINA = 10;

interface EstadoHistorico {
  motoristaId: number | null;
  viagens: ViagemHistorico[];
  pagina: number;
  totalViagens: number;
  ultimaPagina: boolean;
  carregando: boolean;
  erro: string | null;
  carregandoMais: boolean;
  erroMais: string | null;
}

const ESTADO_INICIAL: EstadoHistorico = {
  motoristaId: null,
  viagens: [],
  pagina: 0,
  totalViagens: 0,
  ultimaPagina: true,
  carregando: true,
  erro: null,
  carregandoMais: false,
  erroMais: null,
};

function mensagemDeErro(erro: unknown): string {
  return erro instanceof Error
    ? erro.message
    : "Não foi possível carregar o histórico de viagens.";
}

export function useHistoricoViagens(motoristaId: number | null, open: boolean) {
  const [estado, setEstado] = useState<EstadoHistorico>(ESTADO_INICIAL);
  const [versao, setVersao] = useState(0);
  const controllerMaisRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!open || motoristaId === null) return;

    const id = motoristaId;
    const controller = new AbortController();

    async function carregar() {
      setEstado({ ...ESTADO_INICIAL, motoristaId: id });

      try {
        const resultado = await buscarHistoricoViagens(
          id,
          0,
          TAMANHO_PAGINA,
          controller.signal,
        );
        setEstado({
          ...ESTADO_INICIAL,
          motoristaId: id,
          viagens: mesclarViagens([], resultado.viagens),
          pagina: resultado.pagina,
          totalViagens: resultado.totalViagens,
          ultimaPagina: resultado.ultimaPagina,
          carregando: false,
        });
      } catch (erroCarregamento) {
        if (controller.signal.aborted) return;
        setEstado({
          ...ESTADO_INICIAL,
          motoristaId: id,
          carregando: false,
          erro: mensagemDeErro(erroCarregamento),
        });
      }
    }

    void carregar();
    return () => {
      controller.abort();
      controllerMaisRef.current?.abort();
      controllerMaisRef.current = null;
      setEstado(ESTADO_INICIAL);
    };
  }, [open, motoristaId, versao]);

  const atual =
    open && motoristaId !== null && estado.motoristaId === motoristaId
      ? estado
      : ESTADO_INICIAL;

  function carregarMais() {
    if (
      atual.motoristaId === null ||
      atual.carregando ||
      atual.erro !== null ||
      atual.carregandoMais ||
      atual.ultimaPagina
    ) {
      return;
    }

    const id = atual.motoristaId;
    const proximaPagina = atual.pagina + 1;
    const controller = new AbortController();
    controllerMaisRef.current?.abort();
    controllerMaisRef.current = controller;

    setEstado((anterior) => ({ ...anterior, carregandoMais: true, erroMais: null }));

    buscarHistoricoViagens(id, proximaPagina, TAMANHO_PAGINA, controller.signal)
      .then((resultado) => {
        if (controller.signal.aborted) return;
        setEstado((anterior) =>
          anterior.motoristaId !== id
            ? anterior
            : {
                ...anterior,
                viagens: mesclarViagens(anterior.viagens, resultado.viagens),
                pagina: resultado.pagina,
                totalViagens: resultado.totalViagens,
                ultimaPagina: resultado.ultimaPagina,
                carregandoMais: false,
              },
        );
      })
      .catch((erroCarregamento: unknown) => {
        if (controller.signal.aborted) return;
        setEstado((anterior) =>
          anterior.motoristaId !== id
            ? anterior
            : {
                ...anterior,
                carregandoMais: false,
                erroMais: mensagemDeErro(erroCarregamento),
              },
        );
      })
      .finally(() => {
        if (controllerMaisRef.current === controller) {
          controllerMaisRef.current = null;
        }
      });
  }

  const tentarDeNovo = useCallback(() => setVersao((valor) => valor + 1), []);

  return {
    viagens: atual.viagens,
    pagina: atual.pagina,
    totalViagens: atual.totalViagens,
    ultimaPagina: atual.ultimaPagina,
    carregando: atual.carregando,
    erro: atual.erro,
    carregandoMais: atual.carregandoMais,
    erroMais: atual.erroMais,
    carregarMais,
    tentarDeNovo,
  };
}
