// Chamada pro endpoint de filtro. Só monta a query string com o que
// o operador de fato preencheu

import type { FiltroViagens } from '../model/types';

export async function filtrarViagensApi(filtro: FiltroViagens) {
  const params = new URLSearchParams();

  if (filtro.apenasDisponiveis) params.set('disponivel', 'true');
  if (filtro.ordenarPor) params.set('ordenarPor', filtro.ordenarPor);
  if (filtro.kmMin !== null) params.set('kmMin', String(filtro.kmMin));
  if (filtro.kmMax !== null) params.set('kmMax', String(filtro.kmMax));
  if (filtro.diasMin !== null) params.set('diasMin', String(filtro.diasMin));
  if (filtro.diasMax !== null) params.set('diasMax', String(filtro.diasMax));

  const response = await fetch(`/api/viagens/filtrar?${params}`);

  if (!response.ok) {
    throw new Error(`Erro ao filtrar: ${response.statusText}`);
  }

  return response.json();
}