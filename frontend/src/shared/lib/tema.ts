import { useSyncExternalStore } from "react";

export type Tema = "claro" | "escuro";

const CHAVE_TEMA = "tema";
const CONSULTA_SISTEMA_ESCURO = "(prefers-color-scheme: dark)";

function lerTemaSalvo(): Tema | null {
  try {
    const salvo = localStorage.getItem(CHAVE_TEMA);
    return salvo === "claro" || salvo === "escuro" ? salvo : null;
  } catch {
    return null;
  }
}

function temaDoSistema(): Tema {
  return window.matchMedia(CONSULTA_SISTEMA_ESCURO).matches ? "escuro" : "claro";
}

function temaAtual(): Tema {
  return document.documentElement.dataset.tema === "escuro" ? "escuro" : "claro";
}

function aplicarTema(tema: Tema) {
  document.documentElement.dataset.tema = tema;
}

function observarTema(aoMudar: () => void) {
  const consulta = window.matchMedia(CONSULTA_SISTEMA_ESCURO);
  const observador = new MutationObserver(aoMudar);

  function seguirSistema() {
    if (lerTemaSalvo() === null) aplicarTema(temaDoSistema());
  }

  observador.observe(document.documentElement, { attributeFilter: ["data-tema"] });
  consulta.addEventListener("change", seguirSistema);

  return () => {
    observador.disconnect();
    consulta.removeEventListener("change", seguirSistema);
  };
}

function salvarTema(tema: Tema): boolean {
  try {
    localStorage.setItem(CHAVE_TEMA, tema);
    return true;
  } catch {
    return false;
  }
}

export function alternarTema() {
  const proximo: Tema = temaAtual() === "escuro" ? "claro" : "escuro";
  salvarTema(proximo);
  aplicarTema(proximo);
}

export function useTema(): Tema {
  return useSyncExternalStore(observarTema, temaAtual);
}
