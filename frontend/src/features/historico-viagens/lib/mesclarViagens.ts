export function mesclarViagens<T extends { id: number }>(
  atuais: readonly T[],
  novas: readonly T[],
): T[] {
  const ids = new Set(atuais.map((viagem) => viagem.id));
  const ineditas = novas.filter((viagem) => {
    if (ids.has(viagem.id)) return false;
    ids.add(viagem.id);
    return true;
  });

  return [...atuais, ...ineditas];
}
