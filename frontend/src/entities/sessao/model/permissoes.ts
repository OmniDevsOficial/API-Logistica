import type { Perfil } from "./types";

const ROTAS_POR_PERFIL: Record<Perfil, readonly string[]> = {
  // Registros é só leitura e mostra o que o próprio perfil já pode importar.
  GESTOR: ["/", "/motoristas", "/motoristas/utilizacao", "/viagens", "/registros", "/ranking"],
  OPERADOR: ["/viagens", "/motoristas", "/registros"],
};

const AREAS_POR_PERFIL: Record<Perfil, readonly string[]> = {
  GESTOR: ["/administracao"],
  OPERADOR: [],
};

export function podeAcessar(perfil: Perfil, rota: string): boolean {
  return (
    ROTAS_POR_PERFIL[perfil].includes(rota) ||
    AREAS_POR_PERFIL[perfil].some(
      (area) => rota === area || rota.startsWith(`${area}/`),
    )
  );
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

export function podeVerCadastroUsuarios(perfil: Perfil): boolean {
  return perfil === "GESTOR";
}

/** Gestor e operador carregam a frota pela planilha de veículos. */
export function podeImportarVeiculos(perfil: Perfil): boolean {
  return perfil === "GESTOR" || perfil === "OPERADOR";
}
