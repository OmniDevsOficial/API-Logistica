import type { StatusImportacao } from "../model/types";

interface StatusImportacaoBadgeProps {
  status: StatusImportacao;
}

const STATUS_LABEL: Record<StatusImportacao, string> = {
  sucesso: "Sucesso",
  parcial: "Parcial",
  erro: "Erro",
};

const STATUS_CLASS: Record<StatusImportacao, string> = {
  sucesso: "bg-success/15 text-success",
  parcial: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  erro: "bg-alerta/15 text-alerta",
};

/** Selo colorido do status da importação na tabela de registros. */
export function StatusImportacaoBadge({ status }: StatusImportacaoBadgeProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold ${STATUS_CLASS[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
