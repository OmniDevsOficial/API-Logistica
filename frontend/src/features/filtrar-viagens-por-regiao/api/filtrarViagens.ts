// o proxy do vite.config.ts já redireciona /api pro backend
export async function filtrarViagensApi(destino: string) {
  const response = await fetch(
    `/api/viagens/filtrar?destino=${encodeURIComponent(destino)}`
  );

  if (!response.ok) {
    throw new Error(`Erro ao filtrar: ${response.statusText}`);
  }

  return response.json();
}