import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buscarAlertasUtilizacao } from "@entities/motorista";
import type { AlertaUtilizacao } from "@entities/motorista";
import { buscarImportacoes, EVENTO_IMPORTACAO_CONCLUIDA } from "@entities/importacao";
import type { ImportacaoHistorico } from "@entities/importacao";
import {
  podeVerAlertasUtilizacao,
  podeVerCadastroUsuarios,
  useSessao,
} from "@entities/sessao";
import { EVENTO_USUARIO_CADASTRADO, listarUsuarios } from "@entities/usuario";
import type { Usuario } from "@entities/usuario";
import { inicioJanelaRecente, montarNotificacoes } from "../lib/montarNotificacoes";
import {
  adicionarDispensadas,
  lerDispensadas,
  salvarDispensadas,
} from "../lib/notificacoesDispensadas";
import type { Notificacao } from "./types";

interface Eventos {
  importacoes: ImportacaoHistorico[];
  usuarios: Usuario[];
  desde: Date;
}

function dataIso(data: Date): string {
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${data.getFullYear()}-${mes}-${dia}`;
}

function armazenamentoLocal(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

interface Dispensadas {
  email: string | null;
  chaves: string[];
}

export interface NotificacoesDoUsuario {
  notificacoes: Notificacao[];
  dispensar: (chaves: string[]) => void;
}

function valoresCumpridos<T>(resultado: PromiseSettledResult<T[]>): T[] {
  return resultado.status === "fulfilled" ? resultado.value : [];
}

export function useNotificacoes(
  dataInicio?: string,
  dataFim?: string,
): NotificacoesDoUsuario {
  const { usuario } = useSessao();
  const perfil = usuario?.perfil ?? null;
  const email = usuario?.email ?? null;
  const verAlertas = perfil !== null && podeVerAlertasUtilizacao(perfil);
  const verUsuarios = perfil !== null && podeVerCadastroUsuarios(perfil);

  const [alertas, setAlertas] = useState<AlertaUtilizacao[]>([]);
  const [eventos, setEventos] = useState<Eventos | null>(null);
  const [atualizacao, setAtualizacao] = useState(0);
  const [dispensadas, setDispensadas] = useState<Dispensadas>({ email: null, chaves: [] });
  const chavesDispensadas = useMemo(
    () =>
      dispensadas.email === email || email === null
        ? dispensadas.chaves
        : lerDispensadas(armazenamentoLocal(), email),
    [dispensadas, email],
  );
  const dispensadasRef = useRef(chavesDispensadas);

  useEffect(() => {
    dispensadasRef.current = chavesDispensadas;
  }, [chavesDispensadas]);

  useEffect(() => {
    function atualizar() {
      setAtualizacao((valor) => valor + 1);
    }

    function atualizarAoRetornar() {
      if (document.visibilityState === "visible") atualizar();
    }

    window.addEventListener("focus", atualizarAoRetornar);
    document.addEventListener("visibilitychange", atualizarAoRetornar);
    window.addEventListener(EVENTO_IMPORTACAO_CONCLUIDA, atualizar);
    window.addEventListener(EVENTO_USUARIO_CADASTRADO, atualizar);

    return () => {
      window.removeEventListener("focus", atualizarAoRetornar);
      document.removeEventListener("visibilitychange", atualizarAoRetornar);
      window.removeEventListener(EVENTO_IMPORTACAO_CONCLUIDA, atualizar);
      window.removeEventListener(EVENTO_USUARIO_CADASTRADO, atualizar);
    };
  }, []);

  useEffect(() => {
    if (!verAlertas) return;

    const controller = new AbortController();

    buscarAlertasUtilizacao(controller.signal, dataInicio, dataFim)
      .then(setAlertas)
      .catch(() => {
        if (!controller.signal.aborted) setAlertas([]);
      });

    return () => controller.abort();
  }, [verAlertas, atualizacao, dataInicio, dataFim]);

  useEffect(() => {
    if (perfil === null) return;

    const controller = new AbortController();
    const desde = inicioJanelaRecente(new Date());
    const de = dataIso(desde);

    Promise.allSettled([
      buscarImportacoes({ tipo: "manifesto", de }, controller.signal),
      buscarImportacoes({ tipo: "veiculos", de }, controller.signal),
      verUsuarios ? listarUsuarios(controller.signal) : Promise.resolve([]),
    ]).then(([manifestos, veiculos, usuarios]) => {
      if (controller.signal.aborted) return;
      setEventos({
        importacoes: [...valoresCumpridos(manifestos), ...valoresCumpridos(veiculos)],
        usuarios: valoresCumpridos(usuarios),
        desde,
      });
    });

    return () => controller.abort();
  }, [perfil, verUsuarios, atualizacao]);

  const notificacoes = useMemo(() => {
    if (perfil === null) return [];
    const ocultas = new Set(chavesDispensadas);
    return montarNotificacoes({
      alertas: verAlertas ? alertas : [],
      importacoes: eventos?.importacoes ?? [],
      usuarios: verUsuarios ? (eventos?.usuarios ?? []) : [],
      desde: eventos?.desde ?? inicioJanelaRecente(new Date()),
    }).filter((notificacao) => !ocultas.has(notificacao.chave));
  }, [perfil, verAlertas, verUsuarios, alertas, eventos, chavesDispensadas]);

  const dispensar = useCallback(
    (chaves: string[]) => {
      if (email === null || chaves.length === 0) return;
      const atualizadas = adicionarDispensadas(dispensadasRef.current, chaves);
      dispensadasRef.current = atualizadas;
      salvarDispensadas(armazenamentoLocal(), email, atualizadas);
      setDispensadas({ email, chaves: atualizadas });
    },
    [email],
  );

  return { notificacoes, dispensar };
}
