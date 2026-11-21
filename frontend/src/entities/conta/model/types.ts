import type { Perfil } from "@entities/sessao";

export interface Conta {
  id: number;
  nome: string;
  email: string;
  perfil: Perfil;
  ativo: boolean;
  criadoEm: string;
  foto: string | null;
}
