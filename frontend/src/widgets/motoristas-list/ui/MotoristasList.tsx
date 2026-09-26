import type { MotoristaUtilizacao } from "@entities/motorista";

interface MotoristasListProps {
  motoristas: MotoristaUtilizacao[];
}

function formatarUtilizacao(motorista: MotoristaUtilizacao) {
  if (motorista.status === "SEM_VIAGENS") {
    return "Sem viagens no período";
  }

  return `${motorista.percentualUtilizacao}%`;
}

export function MotoristasList({ motoristas }: MotoristasListProps) {
  if (motoristas.length === 0) {
    return (
      <p className="rounded-md bg-surface p-6 text-center text-sm text-fg-subtle">
        Nenhum motorista encontrado para o período selecionado.
      </p>
    );
  }

  return (
    <div className="flex max-h-[65vh] min-h-0 flex-col rounded-md bg-surface lg:h-full lg:max-h-none">
      <div className="sticky top-0 z-10 grid grid-cols-[1fr_auto] gap-4 rounded-t-md border-b border-border bg-surface px-6 py-4">
        <span className="text-sm font-semibold text-fg">Motorista</span>
        <span className="text-sm font-semibold text-fg">Utilização</span>
      </div>

      <div className="min-h-0 flex-1 divide-y divide-border overflow-y-auto overscroll-contain">
        {motoristas.map((motorista) => (
          <div
            key={motorista.id}
            className="grid grid-cols-[1fr_auto] items-center gap-4 px-6 py-4"
          >
            <span className="text-sm text-fg">{motorista.nome}</span>

            <span className="text-sm font-medium text-fg">
              {formatarUtilizacao(motorista)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
