export const LIMITE_DISPENSADAS = 500;

type Armazenamento = Pick<Storage, "getItem" | "setItem">;

export function chaveArmazenamento(email: string): string {
  return `notificacoes:dispensadas:${email.trim().toLowerCase()}`;
}

export function lerDispensadas(armazenamento: Armazenamento | null, email: string): string[] {
  if (!armazenamento) return [];
  try {
    const salvo: unknown = JSON.parse(armazenamento.getItem(chaveArmazenamento(email)) ?? "[]");
    return Array.isArray(salvo) ? salvo.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function salvarDispensadas(
  armazenamento: Armazenamento | null,
  email: string,
  chaves: string[],
): void {
  if (!armazenamento) return;
  try {
    armazenamento.setItem(
      chaveArmazenamento(email),
      JSON.stringify(chaves.slice(-LIMITE_DISPENSADAS)),
    );
  } catch {
    return;
  }
}

export function adicionarDispensadas(atuais: string[], novas: string[]): string[] {
  const conjunto = new Set(atuais);
  return [...atuais, ...novas.filter((chave) => !conjunto.has(chave))];
}
