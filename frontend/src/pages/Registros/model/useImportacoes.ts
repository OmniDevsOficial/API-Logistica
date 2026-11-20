import { useCallback, useEffect, useMemo, useState } from "react";
import {
  buscarImportacoes,
  type FiltroStatusImportacao,
  type FiltroTipoImportacao,
  type ImportacaoHistorico,
  type TipoImportacao,
} from "@entities/importacao";
import { juntarImportacoes } from "../lib/juntarImportacoes";

const FONTES: TipoImportacao[] = ["manifesto", "veiculos"];

/** Filtro que a tela manda para o back; a busca por nome fica no cliente. */
export interface FiltroRegistros {
  tipo: FiltroTipoImportacao;
  status: FiltroStatusImportacao;
  /** Data "de" em aaaa-mm-dd, vazia quando não filtrada. */
  de: string;
  /** Data "até" em aaaa-mm-dd, vazia quando não filtrada. */
  ate: string;
}

interface EstadoFonte {
  linhas: ImportacaoHistorico[];
  erro: boolean;
}

interface FontesVazias {
  manifesto: EstadoFonte;
  veiculos: EstadoFonte;
}

interface EstadoCarregado {
  /** Filtros (e tentativa) sob os quais `fontes` foi buscado. */
  chave: string;
  fontes: FontesVazias;
}

const fontesVazias = (): FontesVazias => ({
  manifesto: { linhas: [], erro: false },
  veiculos: { linhas: [], erro: false },
});

export interface UseImportacoes {
  /** As duas origens juntas, da mais recente para a mais antiga. */
  linhas: ImportacaoHistorico[];
  carregando: boolean;
  /** As origens consultadas falharam: nenhuma delas respondeu. */
  erroTotal: boolean;
  /** Origens que falharam, para o aviso com botão de tentar de novo. */
  falhas: TipoImportacao[];
  /** Última importação de cada origem, alimentando os cards do topo. */
  ultimas: Record<TipoImportacao, ImportacaoHistorico | null>;
  recarregar: () => void;
  recarregarFonte: (fonte: TipoImportacao) => void;
}

/**
 * Carrega o histórico das duas origens em paralelo. Cada origem tem seu
 * próprio estado de erro: se um serviço falhar, o outro continua na tela e o
 * aviso oferece um novo só para quem falhou.
 *
 * `carregando` é derivado: enquanto os dados guardados não correspondem aos
 * filtros pedidos, a tela está em carga. Assim o efeito só dispara a
 * requisição, sem escrever estado de forma síncrona.
 */
export function useImportacoes(filtro: FiltroRegistros): UseImportacoes {
  const { tipo, status, de, ate } = filtro;
  const [estado, setEstado] = useState<EstadoCarregado>(() => ({
    chave: "",
    fontes: fontesVazias(),
  }));
  const [versao, setVersao] = useState(0);
  // Origem que está sendo recarregada pelo botão "Tentar de novo".
  const [fonteEmAndamento, setFonteEmAndamento] = useState<TipoImportacao | null>(null);

  // "todos" consulta as duas origens; filtrando por tipo, só a escolhida.
  const solicitadas = useMemo<TipoImportacao[]>(
    () => (tipo === "todos" ? [...FONTES] : [tipo]),
    [tipo],
  );

  const chave = useMemo(
    () => `${solicitadas.join(",")}|${status}|${de}|${ate}|${versao}`,
    [solicitadas, status, de, ate, versao],
  );

  useEffect(() => {
    let ativo = true;

    const consulta = solicitadas.map((fonte) =>
      buscarImportacoes({ tipo: fonte, status: status === "todos" ? undefined : status, de, ate }),
    );

    // allSettled: uma origem fora do ar não cancela a outra.
    Promise.allSettled(consulta).then((resultados) => {
      if (!ativo) return;
      setEstado((anteriores) => {
        // Só a origem consultada é substituída: a que ficou de fora do filtro
        // mantém a última lista para os cards do topo continuarem verdadeiros.
        const fontes = { ...anteriores.fontes };
        solicitadas.forEach((fonte, indice) => {
          const resultado = resultados[indice];
          fontes[fonte] =
            resultado.status === "fulfilled"
              ? { linhas: resultado.value, erro: false }
              : { linhas: [], erro: true };
        });
        return { chave, fontes };
      });
    });

    return () => {
      ativo = false;
    };
  }, [chave, solicitadas, status, de, ate]);

  const recarregar = useCallback(() => setVersao((valor) => valor + 1), []);

  const recarregarFonte = useCallback(
    (fonte: TipoImportacao) => {
      setFonteEmAndamento(fonte);
      buscarImportacoes({
        tipo: fonte,
        status: status === "todos" ? undefined : status,
        de,
        ate,
      })
        .then((linhas) => {
          setEstado((anteriores) => ({
            ...anteriores,
            fontes: { ...anteriores.fontes, [fonte]: { linhas, erro: false } },
          }));
        })
        .catch(() => {
          setEstado((anteriores) => ({
            ...anteriores,
            fontes: {
              ...anteriores.fontes,
              [fonte]: { ...anteriores.fontes[fonte], erro: true },
            },
          }));
        })
        .finally(() => setFonteEmAndamento(null));
    },
    [status, de, ate],
  );

  const { fontes } = estado;
  const carregando = estado.chave !== chave || fonteEmAndamento !== null;

  // O filtro de tipo também vale para o back, então a origem que ficou de
  // fora não entra na lista mesmo que tenha dados guardados.
  const linhas = useMemo(() => {
    const manifesto = tipo === "veiculos" ? [] : fontes.manifesto.linhas;
    const veiculos = tipo === "manifesto" ? [] : fontes.veiculos.linhas;
    return juntarImportacoes(manifesto, veiculos);
  }, [fontes, tipo]);

  const falhas = useMemo(
    () => (carregando ? [] : solicitadas.filter((fonte) => fontes[fonte].erro)),
    [fontes, solicitadas, carregando],
  );

  const erroTotal = !carregando && falhas.length === solicitadas.length && solicitadas.length > 0;

  const ultimas = useMemo<Record<TipoImportacao, ImportacaoHistorico | null>>(() => ({
    manifesto: maisRecente(fontes.manifesto.linhas),
    veiculos: maisRecente(fontes.veiculos.linhas),
  }), [fontes]);

  return { linhas, carregando, erroTotal, falhas, ultimas, recarregar, recarregarFonte };
}

/** Defesa contra uma resposta fora de ordem: o card mostra a mais recente. */
function maisRecente(linhas: ImportacaoHistorico[]): ImportacaoHistorico | null {
  return linhas.reduce<ImportacaoHistorico | null>(
    (atual, linha) =>
      atual === null || linha.dataHora.getTime() > atual.dataHora.getTime() ? linha : atual,
    null,
  );
}
