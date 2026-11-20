export type {
  AlertaUtilizacao,
  EquipeMotoristasData,
  MotoristaEquipe,
  MotoristaResumo,
  MotoristaStatus,
  MotoristaUtilizacao,
  PagamentoMotorista,
  RankingColocacao,
  RankingMotorista,
  FiltroRanking,
  ResultadoRankingMotoristas,
  StatusEquipe,
} from "./model/types";
export { buscarAlertasUtilizacao } from "./api/alertaUtilizacaoService";
export { buscarEquipeMotoristas } from "./api/equipeService";
export { buscarRentabilidadeMotoristas } from "./api/rentabilidadeMotoristasService";
export { buscarRankingMotoristas } from "./api/rankingMotoristasService";
export { buscarPagamentoMotoristas } from "./api/pagamentoMotoristasService";
export {
  faturamentoDoMotorista,
  indexarFaturamento,
  type IndiceFaturamento,
} from "./lib/faturamentoMotorista";
export { buscarResumoMotoristas } from "./api/motoristaResumoService";
export { atualizarStatusMotorista } from "./api/statusMotoristaService";
