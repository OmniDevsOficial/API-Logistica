import type { Perfil } from "@entities/sessao";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: Perfil;
  criadoEm: string;
}

export interface NovoUsuario {
  nome: string;
  email: string;
  perfil: Perfil;
  senha: string;
}

export type CampoUsuario = keyof NovoUsuario;

export type ErrosCamposUsuario = Partial<Record<CampoUsuario, string>>;
