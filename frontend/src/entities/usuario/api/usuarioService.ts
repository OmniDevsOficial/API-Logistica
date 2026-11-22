import { apiFetch } from "../../../shared/api/apiFetch.ts";
import type {
  CampoUsuario,
  ErrosCamposUsuario,
  NovoUsuario,
  Usuario,
} from "../model/types";
import { avisarUsuarioCadastrado } from "../lib/avisoUsuarioCadastrado.ts";

const ENDPOINT = "/api/autenticacao/usuarios";

const CAMPOS: readonly CampoUsuario[] = ["nome", "email", "perfil", "senha"];
const PERFIS = ["GESTOR", "OPERADOR"];

export const MENSAGEM_EMAIL_EM_USO = "Esse e-mail já está em uso.";
const MENSAGEM_SEM_PERMISSAO = "Seu perfil não tem permissão para gerenciar usuários.";
const MENSAGEM_SESSAO_EXPIRADA = "Sua sessão expirou. Entre novamente.";
const MENSAGEM_REDE = "Não foi possível conectar ao servidor. Verifique sua conexão e tente de novo.";
const MENSAGEM_SERVIDOR = "Não foi possível cadastrar o usuário agora. Tente de novo em instantes.";
const MENSAGEM_CAMPOS = "Revise os campos destacados.";
const MENSAGEM_LISTA = "Não foi possível carregar os usuários.";
const MENSAGEM_LISTA_INVALIDA = "A resposta da lista de usuários está inválida.";
const MENSAGEM_STATUS = "Não foi possível alterar o status do usuário agora. Tente de novo em instantes.";
const MENSAGEM_USUARIO_NAO_ENCONTRADO = "Esse usuário não existe mais. Atualize a lista.";
const MENSAGEM_AUTO_DESATIVACAO = "Você não pode desativar o seu próprio usuário.";

export type MotivoErroCadastro =
  | "campos"
  | "conflito"
  | "sessao"
  | "permissao"
  | "rede"
  | "servidor";

export class ErroCadastroUsuario extends Error {
  readonly motivo: MotivoErroCadastro;
  readonly campos: ErrosCamposUsuario;

  constructor(
    motivo: MotivoErroCadastro,
    mensagem: string,
    campos: ErrosCamposUsuario = {},
  ) {
    super(mensagem);
    this.name = "ErroCadastroUsuario";
    this.motivo = motivo;
    this.campos = campos;
  }
}

function lerUsuario(item: unknown): Usuario | null {
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
    perfil: registro.perfil as Usuario["perfil"],
    ativo: registro.ativo,
    criadoEm: registro.criadoEm,
    foto: typeof registro.foto === "string" ? registro.foto : null,
  };
}

function lerCampos(corpo: unknown): ErrosCamposUsuario {
  if (corpo === null || typeof corpo !== "object") return {};
  const { campos } = corpo as Record<string, unknown>;
  if (campos === null || typeof campos !== "object") return {};

  const erros: ErrosCamposUsuario = {};
  for (const campo of CAMPOS) {
    const mensagem = (campos as Record<string, unknown>)[campo];
    if (typeof mensagem === "string" && mensagem.trim() !== "") {
      erros[campo] = mensagem;
    }
  }
  return erros;
}

function lerMensagem(corpo: unknown): string | null {
  if (corpo === null || typeof corpo !== "object") return null;
  const { erro } = corpo as Record<string, unknown>;
  return typeof erro === "string" && erro.trim() !== "" ? erro : null;
}

export async function listarUsuarios(signal?: AbortSignal): Promise<Usuario[]> {
  const resposta = await apiFetch(ENDPOINT, { signal });

  if (resposta.status === 403) throw new Error(MENSAGEM_SEM_PERMISSAO);
  if (!resposta.ok) throw new Error(MENSAGEM_LISTA);

  const dados: unknown = await resposta.json().catch(() => null);
  if (!Array.isArray(dados)) throw new Error(MENSAGEM_LISTA_INVALIDA);

  const usuarios = dados.map(lerUsuario);
  if (usuarios.some((usuario) => usuario === null)) {
    throw new Error(MENSAGEM_LISTA_INVALIDA);
  }

  return usuarios as Usuario[];
}

export async function cadastrarUsuario(novo: NovoUsuario): Promise<Usuario> {
  let resposta: Response;

  try {
    resposta = await apiFetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: novo.nome.trim(),
        email: novo.email.trim().toLowerCase(),
        perfil: novo.perfil,
        senha: novo.senha,
      }),
    });
  } catch {
    throw new ErroCadastroUsuario("rede", MENSAGEM_REDE);
  }

  const corpo: unknown = await resposta.json().catch(() => null);

  if (resposta.status === 400) {
    const campos = lerCampos(corpo);
    throw new ErroCadastroUsuario(
      "campos",
      Object.keys(campos).length > 0 ? MENSAGEM_CAMPOS : lerMensagem(corpo) ?? MENSAGEM_CAMPOS,
      campos,
    );
  }
  if (resposta.status === 409) {
    throw new ErroCadastroUsuario("conflito", MENSAGEM_EMAIL_EM_USO, {
      email: MENSAGEM_EMAIL_EM_USO,
    });
  }
  if (resposta.status === 401) {
    throw new ErroCadastroUsuario("sessao", MENSAGEM_SESSAO_EXPIRADA);
  }
  if (resposta.status === 403) {
    throw new ErroCadastroUsuario("permissao", MENSAGEM_SEM_PERMISSAO);
  }
  if (!resposta.ok) {
    throw new ErroCadastroUsuario("servidor", MENSAGEM_SERVIDOR);
  }

  const usuario = lerUsuario(corpo);
  if (!usuario) throw new ErroCadastroUsuario("servidor", MENSAGEM_SERVIDOR);

  avisarUsuarioCadastrado();
  return usuario;
}

export async function alterarStatusUsuario(id: number, ativo: boolean): Promise<Usuario> {
  let resposta: Response;

  try {
    resposta = await apiFetch(`${ENDPOINT}/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ativo }),
    });
  } catch {
    throw new Error(MENSAGEM_REDE);
  }

  const corpo: unknown = await resposta.json().catch(() => null);

  if (resposta.status === 401) throw new Error(MENSAGEM_SESSAO_EXPIRADA);
  if (resposta.status === 403) throw new Error(MENSAGEM_SEM_PERMISSAO);
  if (resposta.status === 404) throw new Error(MENSAGEM_USUARIO_NAO_ENCONTRADO);
  if (resposta.status === 409) throw new Error(lerMensagem(corpo) ?? MENSAGEM_AUTO_DESATIVACAO);
  if (!resposta.ok) throw new Error(MENSAGEM_STATUS);

  const usuario = lerUsuario(corpo);
  if (!usuario) throw new Error(MENSAGEM_STATUS);

  return usuario;
}
