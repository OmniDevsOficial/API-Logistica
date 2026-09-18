export type FiltroDestino = {
    destino: string;
};

export type EstadoFiltro = {
    filtroAtivo: FiltroDestino | null;
    carregando: boolean;
    erro: string | null;
    resultados: any[];
}