export type {
  EquipeMotoristasData,
  MotoristaEquipe,
  MotoristaResumo,
  MotoristaStatus,
  MotoristaUtilizacao,
  StatusEquipe,
} from "./model/types";
export { buscarEquipeMotoristas } from "./api/equipeService";
export { buscarResumoMotoristas } from "./api/motoristaResumoService";
export { atualizarStatusMotorista } from "./api/statusMotoristaService";
