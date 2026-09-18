import { ViagemRankingItem, type Viagem } from "@entities/viagem";

interface ViagensRankingProps {
  viagens: Viagem[];
}

const TOP_RANKING_SIZE = 10;

export function ViagensRanking({ viagens }: ViagensRankingProps) {
  const topViagens = viagens.slice(0, TOP_RANKING_SIZE);

  return (
    <div className="flex flex-col gap-2 rounded-md bg-surface p-6">
      <h2 className="text-[15px] font-semibold text-fg">
        Viagens mais concorridas
      </h2>
      <div className="flex flex-col divide-y divide-border">
        {topViagens.map((viagem, index) => (
          <ViagemRankingItem key={viagem.id} posicao={index + 1} viagem={viagem} />
        ))}
      </div>
    </div>
  );
}
