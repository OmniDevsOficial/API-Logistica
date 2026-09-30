import type { ViagensData } from "../model/types";

const MOCK_VIAGENS_DATA: ViagensData = {
  periodoLabel: "1 Setembro 2026",
  viagens: [
    { id: "1", origem: "Campinas, SP", destino: "Ribeirão Preto, SP", freteEstimado: 8500, veiculo: "Truck", distanciaKm: 220, estimativaDias: 2, status: "disponivel" },
    { id: "2", origem: "São Paulo, SP", destino: "Sorocaba, SP", freteEstimado: 3200, veiculo: "Toco", distanciaKm: 95, estimativaDias: 1, status: "confirmada" },
    { id: "3", origem: "Bauru, SP", destino: "Presidente Prudente, SP", freteEstimado: 9800, veiculo: "Bitrem", distanciaKm: 280, estimativaDias: 2, status: "concluida" },
    { id: "4", origem: "São José dos Campos, SP", destino: "Taubaté, SP", freteEstimado: 1500, veiculo: "VUC", distanciaKm: 45, estimativaDias: 1, status: "disponivel" },
    { id: "5", origem: "Piracicaba, SP", destino: "Limeira, SP", freteEstimado: 900, veiculo: "Fiorino", distanciaKm: 35, estimativaDias: 1, status: "confirmada" },
    { id: "6", origem: "Franca, SP", destino: "Ribeirão Preto, SP", freteEstimado: 2100, veiculo: "Van", distanciaKm: 90, estimativaDias: 1, status: "concluida" },
    { id: "7", origem: "Campinas, SP", destino: "São Paulo, SP", freteEstimado: 4200, veiculo: "Carreta", distanciaKm: 100, estimativaDias: 1, status: "disponivel" },
    { id: "8", origem: "Araraquara, SP", destino: "Bauru, SP", freteEstimado: 3600, veiculo: "3/4", distanciaKm: 140, estimativaDias: 2, status: "confirmada" },
    { id: "9", origem: "Marília, SP", destino: "Presidente Prudente, SP", freteEstimado: 5200, veiculo: "Truck", distanciaKm: 160, estimativaDias: 2, status: "concluida" },
    { id: "10", origem: "Sorocaba, SP", destino: "Itapetininga, SP", freteEstimado: 1900, veiculo: "Toco", distanciaKm: 75, estimativaDias: 1, status: "disponivel" },
    { id: "11", origem: "Ribeirão Preto, SP", destino: "Uberaba, MG", freteEstimado: 7300, veiculo: "Bitrem", distanciaKm: 190, estimativaDias: 2, status: "confirmada" },
    { id: "12", origem: "São Paulo, SP", destino: "Campinas, SP", freteEstimado: 2800, veiculo: "VUC", distanciaKm: 100, estimativaDias: 1, status: "concluida" },
  ],
};

export async function getViagensData(): Promise<ViagensData> {
  return MOCK_VIAGENS_DATA;
}
