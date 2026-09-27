import type { StatusViagem } from "../model/types";

interface StatusViagemBadgeProps {
  status: StatusViagem;
}

const STATUS_LABEL: Record<StatusViagem, string> = {
  pendente: "Pendente",
  em_transito: "Em Trânsito",
  finalizado: "Finalizado",
};

const STATUS_CLASS: Record<StatusViagem, string> = {
  pendente: "bg-border text-fg-muted",
  em_transito: "bg-primary/10 text-primary",
  finalizado: "bg-success/15 text-success",
};

export function StatusViagemBadge({ status }: StatusViagemBadgeProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold ${STATUS_CLASS[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
