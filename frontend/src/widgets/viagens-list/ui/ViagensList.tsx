import { ViagemCard, type Viagem } from "@entities/viagem";

interface ViagensListProps {
  viagens: Viagem[];
}

export function ViagensList({ viagens }: ViagensListProps) {
  return (
    <div className="scrollbar-hide flex flex-col gap-4 lg:h-full lg:min-h-0 lg:overflow-y-auto">
      {viagens.length === 0 ? (
        <p className="rounded-md bg-surface p-6 text-center text-sm text-fg-subtle">
          Nenhuma viagem encontrada.
        </p>
      ) : (
        viagens.map((viagem) => <ViagemCard key={viagem.id} viagem={viagem} />)
      )}
    </div>
  );
}
