import type { Viagem } from "../model/types";
import { StatusViagemBadge } from "./StatusViagemBadge";

interface ViagemRankingItemProps {
  posicao: number;
  viagem: Viagem;
}

export function ViagemRankingItem({ posicao, viagem }: ViagemRankingItemProps) {
  return (
    <div className="flex items-center gap-3 py-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
        {posicao}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-fg">
          {viagem.origem} -&gt; {viagem.destino}
        </p>
        <p className="truncate text-[13px] text-fg-subtle">
          {viagem.veiculo} · {viagem.distanciaKm}km · estimativa{" "}
          {viagem.estimativaDias} dias
        </p>
      </div>
      <StatusViagemBadge status={viagem.status} />
    </div>
  );
}
