export type {
  AlertaUtilizacao,
  EquipeMotoristasData,
  MotoristaEquipe,
  MotoristaResumo,
  MotoristaStatus,
  MotoristaUtilizacao,
  RankingColocacao,
  RankingMotorista,
  StatusEquipe,
} from "./model/types";
export { buscarAlertasUtilizacao } from "./api/alertaUtilizacaoService";
export { buscarEquipeMotoristas } from "./api/equipeService";
export { buscarRentabilidadeMotoristas } from "./api/rentabilidadeMotoristasService";
export { buscarRankingMotoristas } from "./api/rankingMotoristasService";
export { buscarResumoMotoristas } from "./api/motoristaResumoService";
export { atualizarStatusMotorista } from "./api/statusMotoristaService";
