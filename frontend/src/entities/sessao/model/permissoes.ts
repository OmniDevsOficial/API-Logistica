import type { Perfil } from "./types";

const ROTAS_POR_PERFIL: Record<Perfil, readonly string[]> = {
  GESTOR: ["/", "/motoristas", "/motoristas/utilizacao", "/viagens", "/ranking"],
  OPERADOR: ["/viagens", "/motoristas"],
};

export function podeAcessar(perfil: Perfil, rota: string): boolean {
  return ROTAS_POR_PERFIL[perfil].includes(rota);
}

export function rotaInicial(perfil: Perfil): string {
  return ROTAS_POR_PERFIL[perfil][0];
}

/** Valores monetários ficam borrados para quem não é gestor. */
export function podeVerValoresMonetarios(perfil: Perfil): boolean {
  return perfil === "GESTOR";
}

export function podeVerAlertasUtilizacao(perfil: Perfil): boolean {
  return perfil === "GESTOR";
}

/** Gestor e operador carregam a frota pela planilha de veículos. */
export function podeImportarVeiculos(perfil: Perfil): boolean {
  return perfil === "GESTOR" || perfil === "OPERADOR";
}
