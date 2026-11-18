import { apiFetch } from "../../../shared/api/apiFetch.ts";
import type { Conta } from "../model/types";

const ENDPOINT = "/api/autenticacao/perfil";
const PERFIS = ["GESTOR", "OPERADOR"];

const MENSAGEM_CARREGAR = "Não foi possível carregar o seu perfil.";
const MENSAGEM_SALVAR = "Não foi possível salvar agora. Tente de novo em instantes.";
const MENSAGEM_SESSAO = "Sua sessão expirou. Entre novamente.";
const MENSAGEM_REDE = "Não foi possível conectar ao servidor. Verifique sua conexão e tente de novo.";
const MENSAGEM_RESPOSTA = "A resposta do servidor veio inválida.";

export interface ContaAtualizada {
  conta: Conta;
  token: string;
}

export function lerConta(item: unknown): Conta | null {
  if (item === null || typeof item !== "object") return null;
  const registro = item as Record<string, unknown>;

  if (
    typeof registro.id !== "number" ||
    typeof registro.nome !== "string" ||
    typeof registro.email !== "string" ||
    typeof registro.perfil !== "string" ||
    !PERFIS.includes(registro.perfil) ||
    typeof registro.ativo !== "boolean" ||
    typeof registro.criadoEm !== "string" ||
    (registro.foto !== null && registro.foto !== undefined && typeof registro.foto !== "string")
  ) {
    return null;
  }

  return {
    id: registro.id,
    nome: registro.nome,
    email: registro.email,
    perfil: registro.perfil as Conta["perfil"],
    ativo: registro.ativo,
    criadoEm: registro.criadoEm,
    foto: typeof registro.foto === "string" ? registro.foto : null,
  };
}

function mensagemDoCorpo(corpo: unknown): string | null {
  if (corpo === null || typeof corpo !== "object") return null;
  const { erro, campos } = corpo as Record<string, unknown>;

  if (campos !== null && typeof campos === "object") {
    const primeira = Object.values(campos as Record<string, unknown>).find(
      (mensagem) => typeof mensagem === "string" && mensagem.trim() !== "",
    );
    if (typeof primeira === "string") return primeira;
  }
  return typeof erro === "string" && erro.trim() !== "" ? erro : null;
}

async function enviar(url: string, corpo: unknown): Promise<unknown> {
  let resposta: Response;

  try {
    resposta = await apiFetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corpo),
    });
  } catch {
    throw new Error(MENSAGEM_REDE);
  }

  const dados: unknown = await resposta.json().catch(() => null);

  if (resposta.status === 401) throw new Error(MENSAGEM_SESSAO);
  if (resposta.status === 400 || resposta.status === 404) {
    throw new Error(mensagemDoCorpo(dados) ?? MENSAGEM_SALVAR);
  }
  if (!resposta.ok) throw new Error(MENSAGEM_SALVAR);

  return dados;
}

export async function buscarConta(signal?: AbortSignal): Promise<Conta> {
  const resposta = await apiFetch(ENDPOINT, { signal });

  if (resposta.status === 401) throw new Error(MENSAGEM_SESSAO);
  if (!resposta.ok) throw new Error(MENSAGEM_CARREGAR);

  const conta = lerConta(await resposta.json().catch(() => null));
  if (!conta) throw new Error(MENSAGEM_RESPOSTA);

  return conta;
}

export async function alterarNomeConta(nome: string): Promise<ContaAtualizada> {
  const dados = await enviar(ENDPOINT, { nome: nome.trim() });
  const registro = dados !== null && typeof dados === "object" ? (dados as Record<string, unknown>) : {};
  const conta = lerConta(registro.perfil);

  if (!conta || typeof registro.token !== "string") throw new Error(MENSAGEM_RESPOSTA);

  return { conta, token: registro.token };
}

export async function alterarFotoConta(foto: string | null): Promise<Conta> {
  const conta = lerConta(await enviar(`${ENDPOINT}/foto`, { foto }));
  if (!conta) throw new Error(MENSAGEM_RESPOSTA);

  return conta;
}
