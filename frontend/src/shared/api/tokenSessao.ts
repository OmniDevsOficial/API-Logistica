const CHAVE_TOKEN = "newelog.token";

type Ouvinte = () => void;

const ouvintes = new Set<Ouvinte>();

function lerArmazenado(): string | null {
  try {
    return localStorage.getItem(CHAVE_TOKEN);
  } catch {
    return null;
  }
}

function gravarArmazenado(token: string | null) {
  try {
    if (token === null) {
      localStorage.removeItem(CHAVE_TOKEN);
    } else {
      localStorage.setItem(CHAVE_TOKEN, token);
    }
  } catch {
    return;
  }
}

let tokenAtual: string | null = lerArmazenado();

function definirToken(token: string | null) {
  tokenAtual = token;
  ouvintes.forEach((ouvinte) => ouvinte());
}

export function obterToken(): string | null {
  return tokenAtual;
}

export function salvarToken(token: string) {
  gravarArmazenado(token);
  definirToken(token);
}

export function limparToken() {
  gravarArmazenado(null);
  definirToken(null);
}

export function assinarToken(ouvinte: Ouvinte): () => void {
  ouvintes.add(ouvinte);
  return () => {
    ouvintes.delete(ouvinte);
  };
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (evento) => {
    if (evento.key === CHAVE_TOKEN || evento.key === null) {
      definirToken(lerArmazenado());
    }
  });
}
