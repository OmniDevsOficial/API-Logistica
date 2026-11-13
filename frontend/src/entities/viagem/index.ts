export type {
  Viagem,
  StatusViagem,
  ViagensData,
  RentabilidadeViagem,
  RankingDestino,
  StatusHistoricoViagem,
  ViagemHistorico,
  PaginaHistoricoViagens,
} from "./model/types";
export { getViagensData, getRentabilidade, getRankingDestinos } from "./api/viagemService";
export { buscarHistoricoViagens } from "./api/historicoViagensService";
export { StatusViagemBadge } from "./ui/StatusViagemBadge";
export { StatusHistoricoBadge } from "./ui/StatusHistoricoBadge";
export { ViagemCard } from "./ui/ViagemCard";
export { ViagemHistoricoCard } from "./ui/ViagemHistoricoCard";
export { ViagemRankingItem } from "./ui/ViagemRankingItem";
