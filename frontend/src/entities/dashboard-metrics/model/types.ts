export type PeriodOption = "dia" | "mes" | "ano";

export type DashboardStatus = "COM_DADOS" | "SEM_DADOS";

export interface ViagensPorStatus {
  pendente: number;
  emTransito: number;
  finalizado: number;
}

export interface DashboardMetrics {
  totalViagens: number;
  freteTotal: number | null;
  freteMedio: number | null;
  kmTotal: number | null;
  motoristasAtivos: number;
  veiculosUtilizados: number;
  viagensPorStatus: ViagensPorStatus;
  custoTotal: number | null;
  custoMedio: number | null;
  rentabilidadeTotal: number | null;
  rentabilidadeMedia: number | null;
  taxaOcupacao: number | null;
}

export interface DashboardData {
  periodo: {
    inicio: string;
    fim: string;
  };
  status: DashboardStatus;
  metrics: DashboardMetrics;
}
