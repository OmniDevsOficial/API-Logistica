import type { StatusEquipe } from "../model/types";

interface StatusMotoristaBadgeProps {
  status: StatusEquipe;
}

const STATUS_LABEL: Record<StatusEquipe, string> = {
  disponivel: "Disponível",
  em_viagem: "Em viagem",
  indisponivel: "Indisponível",
};

const STATUS_CLASS: Record<StatusEquipe, string> = {
  disponivel: "bg-success/15 text-success",
  em_viagem: "bg-primary/10 text-primary",
  indisponivel: "bg-red-500/15 text-red-500",
};

export function StatusMotoristaBadge({ status }: StatusMotoristaBadgeProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold ${STATUS_CLASS[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
