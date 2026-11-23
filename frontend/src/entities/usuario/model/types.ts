import type { Perfil } from "@entities/sessao";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: Perfil;
  ativo: boolean;
  criadoEm: string;
  foto: string | null;
}

export interface NovoUsuario {
  nome: string;
  email: string;
  perfil: Perfil;
  senha: string;
}

export type CampoUsuario = keyof NovoUsuario;

export type ErrosCamposUsuario = Partial<Record<CampoUsuario, string>>;
