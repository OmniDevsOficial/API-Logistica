export type Perfil = "GESTOR" | "OPERADOR";

export interface UsuarioSessao {
  email: string;
  nome: string;
  perfil: Perfil;
  expiraEm: number;
}
