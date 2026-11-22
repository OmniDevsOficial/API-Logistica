import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useSessao } from "@entities/sessao";
import { buscarConta } from "../api/contaService";
import type { Conta } from "./types";

type Ouvinte = () => void;

const ouvintes = new Set<Ouvinte>();
let contaAtual: Conta | null = null;

export function definirContaAtual(conta: Conta | null) {
  contaAtual = conta;
  ouvintes.forEach((ouvinte) => ouvinte());
}

function assinarConta(ouvinte: Ouvinte): () => void {
  ouvintes.add(ouvinte);
  return () => {
    ouvintes.delete(ouvinte);
  };
}

function obterConta(): Conta | null {
  return contaAtual;
}

export function useContaAtual() {
  const { usuario } = useSessao();
  const email = usuario?.email ?? null;
  const conta = useSyncExternalStore(assinarConta, obterConta);
  const [erro, setErro] = useState<string | null>(null);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    if (!email || contaAtual?.email === email) return;

    const controller = new AbortController();
    buscarConta(controller.signal)
      .then((encontrada) => {
        setErro(null);
        definirContaAtual(encontrada);
      })
      .catch((falha: unknown) => {
        if (controller.signal.aborted) return;
        setErro(falha instanceof Error ? falha.message : "Não foi possível carregar o seu perfil.");
      });

    return () => controller.abort();
  }, [email, tentativa]);

  const recarregar = useCallback(() => setTentativa((valor) => valor + 1), []);

  return {
    conta: conta !== null && conta.email === email ? conta : null,
    erro,
    recarregar,
  };
}
