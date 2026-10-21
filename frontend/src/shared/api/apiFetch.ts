import { limparToken, obterToken } from "./tokenSessao.ts";

export async function apiFetch(
  url: string,
  opcoes?: RequestInit,
): Promise<Response> {
  const token = obterToken();
  if (!token) return fetch(url, opcoes);

  const headers = new Headers(opcoes?.headers);
  headers.set("Authorization", `Bearer ${token}`);

  const resposta = await fetch(url, { ...opcoes, headers });

  if (resposta.status === 401 && obterToken() === token) {
    limparToken();
  }

  return resposta;
}
