import type { Perfil } from "@entities/sessao";

export interface FormularioUsuario {
  nome: string;
  email: string;
  perfil: Perfil | "";
  senha: string;
  confirmacao: string;
}

export type CampoFormulario = keyof FormularioUsuario;

export type ErrosFormulario = Partial<Record<CampoFormulario, string>>;

export const FORMULARIO_VAZIO: FormularioUsuario = {
  nome: "",
  email: "",
  perfil: "",
  senha: "",
  confirmacao: "",
};

export const TAMANHO_MAXIMO_NOME = 120;
export const TAMANHO_MINIMO_SENHA = 8;

const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PERFIS: readonly string[] = ["GESTOR", "OPERADOR"];

export function validarFormularioUsuario(
  formulario: FormularioUsuario,
): ErrosFormulario {
  const erros: ErrosFormulario = {};
  const nome = formulario.nome.trim();
  const email = formulario.email.trim();

  if (nome === "") {
    erros.nome = "Informe o nome.";
  } else if (nome.length > TAMANHO_MAXIMO_NOME) {
    erros.nome = `O nome pode ter no máximo ${TAMANHO_MAXIMO_NOME} caracteres.`;
  }

  if (email === "") {
    erros.email = "Informe o e-mail.";
  } else if (!FORMATO_EMAIL.test(email)) {
    erros.email = "Informe um e-mail válido.";
  }

  if (!PERFIS.includes(formulario.perfil)) {
    erros.perfil = "Selecione o perfil.";
  }

  if (formulario.senha === "") {
    erros.senha = "Informe a senha.";
  } else if (formulario.senha.length < TAMANHO_MINIMO_SENHA) {
    erros.senha = `A senha precisa ter no mínimo ${TAMANHO_MINIMO_SENHA} caracteres.`;
  }

  if (formulario.confirmacao === "") {
    erros.confirmacao = "Confirme a senha.";
  } else if (formulario.confirmacao !== formulario.senha) {
    erros.confirmacao = "As senhas não conferem.";
  }

  return erros;
}

export function temErros(erros: ErrosFormulario): boolean {
  return Object.values(erros).some(Boolean);
}
