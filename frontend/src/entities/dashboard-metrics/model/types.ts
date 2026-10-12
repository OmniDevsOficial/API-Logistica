export type PeriodOption = "dia" | "mes" | "ano";

export interface DashboardMetrics {
  rentabilidadeTotal: number;
  rentabilidadeTotalTrendPercent: number;
  rentabilidadeMedia: number;
  viagens: number;
  custoTotal: number;
  taxaOcupacao: number;
  tempoAlocacaoMedia: number;
  utilizacaoFrotaMedia: number;
  fretesValorTotal: number;
  custoMedio: number;
}

export interface RentabilidadeViagensPoint {
  viagensLabel: string;
  rentabilidade: number;
}

export interface UtilizacaoFrotaCategoria {
  categoria: string;
  utilizacao: number;
}

export interface DashboardData {
  periodo: {
    inicio: string;
    fim: string;
  };
  metrics: DashboardMetrics;
  rentabilidadeXViagens: RentabilidadeViagensPoint[];
  utilizacaoMediaFrota: UtilizacaoFrotaCategoria[];
}
