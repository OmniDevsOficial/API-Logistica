export type {
  DashboardData,
  DashboardMetrics,
  DashboardStatus,
  DestinoMaisRentavel,
  PeriodOption,
  PontoRentabilidade,
  RentabilidadeTipoVeiculo,
  SerieRentabilidade,
  ViagensPorStatus,
} from "./model/types";
export { buscarDashboard, getRentabilidadePorTipo } from "./api/dashboardService";
