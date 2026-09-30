import { formatCurrencyBRL } from "@shared/lib";
import type { Viagem } from "../model/types";
import { StatusViagemBadge } from "./StatusViagemBadge";

interface ViagemCardProps {
  viagem: Viagem;
}

export function ViagemCard({ viagem }: ViagemCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-md bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-medium text-fg">
          {viagem.origem} -&gt; {viagem.destino}
        </span>
        <StatusViagemBadge status={viagem.status} />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-fg">
          {formatCurrencyBRL(viagem.freteEstimado)}
        </span>
        <span className="text-[13px] text-fg-subtle">frete estimado</span>
      </div>
      <span className="text-[13px] text-fg-subtle">
        {viagem.veiculo} · {viagem.distanciaKm}km · estimativa {viagem.estimativaDias} dias
      </span>
    </div>
  );
}
