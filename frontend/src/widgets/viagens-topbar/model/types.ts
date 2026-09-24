// Tipos do filtro de viagens do dashboard.
// null significa que não há restrição/limite

export type FiltroViagens = {
    apenasDisponiveis: boolean;
    ordenarPor: 'valor-maior' | 'valor-menor' | null;
    kmMin: Number | null;
    kmMax: Number | null;
    diasMin: Number | null;
    diasMax: Number | null;
}

export const filtroVazio: FiltroViagens = {
    apenasDisponiveis: false,
    ordenarPor: null,
    kmMin: null,
    kmMax: null,
    diasMin: null,
    diasMax: null
}