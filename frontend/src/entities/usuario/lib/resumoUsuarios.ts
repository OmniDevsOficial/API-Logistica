import type { Usuario } from "../model/types";

export interface ResumoUsuarios {
  total: number;
  ativos: number;
  gestores: number;
  operadores: number;
}

export function resumirUsuarios(usuarios: readonly Usuario[]): ResumoUsuarios {
  return usuarios.reduce<ResumoUsuarios>(
    (resumo, usuario) => ({
      total: resumo.total + 1,
      ativos: resumo.ativos + (usuario.ativo ? 1 : 0),
      gestores: resumo.gestores + (usuario.perfil === "GESTOR" ? 1 : 0),
      operadores: resumo.operadores + (usuario.perfil === "OPERADOR" ? 1 : 0),
    }),
    { total: 0, ativos: 0, gestores: 0, operadores: 0 },
  );
}
