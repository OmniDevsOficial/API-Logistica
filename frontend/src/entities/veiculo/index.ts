export type {
  FiltroFrota,
  FiltroVeiculos,
  PaginaFrota,
  PercentualCombustivel,
  PeriodoFrota,
  QuantidadeFrota,
  ResumoFrota,
  Veiculo,
  VeiculoFrota,
  VeiculoResumo,
} from "./model/types";
export {
  buscarTiposVeiculo,
  buscarVeiculoPorPlaca,
  buscarVeiculos,
  lerVeiculoResumo,
} from "./api/veiculoService";
export { buscarFrota, buscarResumoFrota, TIPO_NAO_IDENTIFICADO } from "./api/frotaService";
