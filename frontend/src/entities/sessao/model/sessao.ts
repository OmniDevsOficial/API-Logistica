import { useMemo, useSyncExternalStore } from "react";
import { assinarToken, limparToken, obterToken, salvarToken } from "@shared/api";
import { lerUsuarioDoToken } from "../lib/lerUsuarioDoToken";
import type { UsuarioSessao } from "./types";

export function useSessao(): { usuario: UsuarioSessao | null } {
  const token = useSyncExternalStore(assinarToken, obterToken);
  const usuario = useMemo(() => lerUsuarioDoToken(token), [token]);

  return { usuario };
}

export function iniciarSessao(token: string): boolean {
  if (!lerUsuarioDoToken(token)) return false;
  salvarToken(token);
  return true;
}

export function encerrarSessao() {
  limparToken();
}
