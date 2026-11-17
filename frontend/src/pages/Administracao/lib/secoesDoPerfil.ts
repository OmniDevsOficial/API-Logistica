import type { Perfil } from "@entities/sessao";

interface SecaoComPerfis {
  id: string;
  perfis: readonly Perfil[];
}

export function secoesDoPerfil<T extends SecaoComPerfis>(
  secoes: readonly T[],
  perfil: Perfil,
): T[] {
  return secoes.filter((secao) => secao.perfis.includes(perfil));
}

export function secaoPermitida<T extends SecaoComPerfis>(
  secoes: readonly T[],
  perfil: Perfil,
  id: string | undefined,
): T | null {
  if (!id) return null;
  return secoesDoPerfil(secoes, perfil).find((secao) => secao.id === id) ?? null;
}
