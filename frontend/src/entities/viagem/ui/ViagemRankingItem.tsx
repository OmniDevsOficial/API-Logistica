import { formatCurrencyBRL } from "@shared/lib";
import type { RankingDestino } from "../model/types";

interface ViagemRankingItemProps {
  posicao: number;
  destino: RankingDestino;
}

export function ViagemRankingItem({ posicao, destino }: ViagemRankingItemProps) {
  const rotuloViagens = destino.quantidadeViagens === 1 ? "viagem" : "viagens";

  return (
    <div className="flex items-start gap-3 py-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
        {posicao}
      </span>
      {/* Origem e destino quebram linha para aparecerem completos na coluna fixa. */}
      <div className="min-w-0 flex-1">
        <p className="break-words text-sm font-medium text-fg">
          {destino.origem ?? "Origem não informada"} -&gt; {destino.destino}
        </p>
        <p className="mt-1 text-[13px] text-fg-subtle">
          {destino.quantidadeViagens} {rotuloViagens} ·{" "}
          <span className="font-semibold text-fg">
            {formatCurrencyBRL(destino.rentabilidadeMedia, 2)}
          </span>{" "}
          rentabilidade média
        </p>
      </div>
    </div>
  );
}
