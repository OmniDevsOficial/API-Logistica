import type { StatusHistoricoViagem } from "../model/types";

interface StatusHistoricoBadgeProps {
  status: StatusHistoricoViagem;
}

const STATUS_LABEL: Record<StatusHistoricoViagem, string> = {
  EM_ANDAMENTO: "Em andamento",
  CONCLUIDA: "Concluída",
};

const STATUS_CLASS: Record<StatusHistoricoViagem, string> = {
  EM_ANDAMENTO: "bg-primary/10 text-primary",
  CONCLUIDA: "bg-success/15 text-success",
};

export function StatusHistoricoBadge({ status }: StatusHistoricoBadgeProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold ${STATUS_CLASS[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
