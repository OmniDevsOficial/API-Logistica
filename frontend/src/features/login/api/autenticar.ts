import { iniciarSessao } from "@entities/sessao";
import type { Credenciais } from "../lib/validarCredenciais";

const ENDPOINT = "/api/autenticacao/auth/login";

const CREDENCIAIS_INVALIDAS = "E-mail ou senha inválidos.";
const SERVICO_INDISPONIVEL =
  "Não foi possível entrar no momento. Tente novamente em instantes.";

export class ErroLogin extends Error {}

export function mensagemErroLogin(erro: unknown): string {
  return erro instanceof ErroLogin ? erro.message : SERVICO_INDISPONIVEL;
}

export async function autenticar(credenciais: Credenciais): Promise<void> {
  let resposta: Response;

  try {
    resposta = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credenciais),
    });
  } catch {
    throw new ErroLogin(SERVICO_INDISPONIVEL);
  }

  if (resposta.status === 401 || resposta.status === 403) {
    throw new ErroLogin(CREDENCIAIS_INVALIDAS);
  }
  if (!resposta.ok) throw new ErroLogin(SERVICO_INDISPONIVEL);

  const dados: unknown = await resposta.json().catch(() => null);
  const token =
    dados !== null && typeof dados === "object" && "token" in dados
      ? dados.token
      : null;

  if (typeof token !== "string" || !iniciarSessao(token)) {
    throw new ErroLogin(SERVICO_INDISPONIVEL);
  }
}
