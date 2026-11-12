import { formatIsoDate } from "@shared/lib";
import type { ViagemHistorico } from "../model/types";
import { StatusHistoricoBadge } from "./StatusHistoricoBadge";

interface ViagemHistoricoCardProps {
  viagem: ViagemHistorico;
}

export function ViagemHistoricoCard({ viagem }: ViagemHistoricoCardProps) {
  const origem = viagem.origem ?? "—";
  const destino = viagem.destino ?? "—";
  const previsao = viagem.previsaoChegada
    ? `Previsão ${formatIsoDate(viagem.previsaoChegada)}`
    : "Sem previsão";

  return (
    <div className="flex flex-col gap-2 rounded-md border border-border bg-background p-4">
      <div className="flex items-start justify-between gap-3">
        <span className="min-w-0 break-words text-sm font-semibold text-fg">
          {origem} <span aria-hidden="true">→</span>
          <span className="sr-only">para</span> {destino}
        </span>
        <StatusHistoricoBadge status={viagem.status} />
      </div>

      <span className="text-xs text-fg-muted">Manifesto {viagem.manifesto}</span>

      <div className="flex flex-col gap-0.5 text-xs text-fg-muted sm:flex-row sm:gap-1.5">
        <span>Saída {formatIsoDate(viagem.dataSaida)}</span>
        <span aria-hidden="true" className="hidden sm:inline">
          ·
        </span>
        <span>{previsao}</span>
      </div>
    </div>
  );
}
