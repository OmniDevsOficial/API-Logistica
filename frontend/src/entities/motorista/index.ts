export type {
  EquipeMotoristasData,
  MotoristaEquipe,
  MotoristaResumo,
  MotoristaStatus,
  MotoristaUtilizacao,
  StatusEquipe,
} from "./model/types";
export { buscarEquipeMotoristas } from "./api/equipeService";
export { buscarRentabilidadeMotoristas } from "./api/rentabilidadeMotoristasService";
export { buscarResumoMotoristas } from "./api/motoristaResumoService";
