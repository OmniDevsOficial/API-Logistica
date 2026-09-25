// Tipos do filtro de viagens do dashboard.
// null significa que não há restrição/limite

export type FiltroViagens = {
  destino: string;
  status: StatusViagem[];
  freteMin: number | null;
  freteMax: number | null;
  mes: string; // formato YYYY-MM ou MM
};

export type StatusViagem = 'PENDENTE' | 'EM_TRANSITO' | 'FINALIZADO';

export const filtroVazio: FiltroViagens = {
  destino: '',
  status: [],
  freteMin: null,
  freteMax: null,
  mes: '',
};