import type { DashboardData, PeriodOption } from "../model/types";

const MOCK_DASHBOARD_DATA: DashboardData = {
  periodo: {
    inicio: "2026-09-01",
    fim: "2026-09-30",
  },
  metrics: {
    rentabilidadeTotal: 23305,
    rentabilidadeTotalTrendPercent: 0.58,
    rentabilidadeMedia: 569.23,
    viagens: 102,
    disponiveis: 22,
    custoTotal: 569.23,
    taxaOcupacao: 56,
    tempoAlocacaoMedia: 22,
    utilizacaoFrotaMedia: 56,
    disponiveisMedia: 22,
    fretesValorTotal: 5982.97,
    custoMedio: 569.23,
  },
  rentabilidadeXViagens: [
    { viagensLabel: "0", rentabilidade: 300 },
    { viagensLabel: "10", rentabilidade: 1500 },
    { viagensLabel: "50", rentabilidade: 950 },
    { viagensLabel: "100", rentabilidade: 3600 },
    { viagensLabel: "200", rentabilidade: 2100 },
    { viagensLabel: "500", rentabilidade: 6100 },
    { viagensLabel: "1k", rentabilidade: 9200 },
  ],
  utilizacaoMediaFrota: [
    { categoria: "Fiorino", utilizacao: 45 },
    { categoria: "Truck", utilizacao: 65 },
    { categoria: "Carro", utilizacao: 50 },
    { categoria: "Van", utilizacao: 90 },
    { categoria: "Carreta", utilizacao: 70 },
  ],
};

export async function getDashboardData(
  period: PeriodOption,
): Promise<DashboardData> {
  void period;
  return MOCK_DASHBOARD_DATA;
}
