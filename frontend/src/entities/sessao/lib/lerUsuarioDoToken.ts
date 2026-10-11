import type { Perfil, UsuarioSessao } from "../model/types";

const PERFIS: readonly Perfil[] = ["GESTOR", "OPERADOR"];

function decodificarPayload(token: string): Record<string, unknown> | null {
  const partes = token.split(".");
  if (partes.length !== 3) return null;

  try {
    const base64 = partes[1].replace(/-/g, "+").replace(/_/g, "/");
    const bytes = Uint8Array.from(atob(base64), (caractere) =>
      caractere.charCodeAt(0),
    );
    const payload: unknown = JSON.parse(new TextDecoder().decode(bytes));

    return payload !== null && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

function lerPerfil(valor: unknown): Perfil | null {
  if (typeof valor !== "string") return null;
  const perfil = valor.toUpperCase().replace(/^ROLE_/, "");
  return PERFIS.find((candidato) => candidato === perfil) ?? null;
}

export function lerUsuarioDoToken(token: string | null): UsuarioSessao | null {
  if (!token) return null;

  const payload = decodificarPayload(token);
  if (!payload) return null;

  const { sub, nome, perfil, exp } = payload;
  const perfilLido = lerPerfil(perfil);

  if (typeof sub !== "string" || sub === "") return null;
  if (!perfilLido) return null;
  if (typeof exp !== "number") return null;

  const expiraEm = exp * 1000;
  if (expiraEm <= Date.now()) return null;

  return {
    email: sub,
    nome: typeof nome === "string" && nome.trim() !== "" ? nome : sub,
    perfil: perfilLido,
    expiraEm,
  };
}
