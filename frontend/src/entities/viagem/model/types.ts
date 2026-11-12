export interface Viagem {
  id: number;
  manifesto: string;
  data: string;
  origem: string | null;
  destino: string | null;
  freteEstimado: number | null;
  veiculo: string;
  distanciaKm: number;
  estimativaDias: number;
  status: StatusViagem;
  receita: number | null;
  /** Vale frete. */
  custo: number | null;
  rentabilidade: number | null;
}

export interface RentabilidadeViagem {
  receita: number | null;
  custo: number | null;
  rentabilidade: number | null;
}

export interface RankingDestino {
  origem: string | null;
  destino: string;
  quantidadeViagens: number;
  rentabilidadeMedia: number;
}

export type StatusViagem ="pendente" | "em_transito" | "finalizado";

export interface ViagensData {
  periodoLabel: string;
  viagens: Viagem[];
}

export type StatusHistoricoViagem = "EM_ANDAMENTO" | "CONCLUIDA";

export interface ViagemHistorico {
  id: number;
  manifesto: string;
  origem: string | null;
  destino: string | null;
  dataSaida: string;
  previsaoChegada: string | null;
  status: StatusHistoricoViagem;
}

export interface PaginaHistoricoViagens {
  viagens: ViagemHistorico[];
  pagina: number;
  tamanho: number;
  totalViagens: number;
  totalPaginas: number;
  ultimaPagina: boolean;
}
