export type {
  Viagem,
  StatusViagem,
  ViagensData,
  RentabilidadeViagem,
  RankingDestino,
} from "./model/types";
export { getViagensData, getRentabilidade, getRankingDestinos } from "./api/viagemService";
export { StatusViagemBadge } from "./ui/StatusViagemBadge";
export { ViagemCard } from "./ui/ViagemCard";
export { ViagemRankingItem } from "./ui/ViagemRankingItem";
