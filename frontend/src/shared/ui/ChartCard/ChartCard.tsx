import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

export interface ChartCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function ChartCard({ title, children, className }: ChartCardProps) {
  const cardClassName = [
    "flex min-h-0 flex-col gap-4 rounded-md bg-surface p-6",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClassName}>
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-semibold text-fg">{title}</span>
        <button
          type="button"
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-fg-muted hover:bg-background hover:text-fg"
          aria-label="Expandir gráfico"
        >
          <ArrowUpRight size={16} />
        </button>
      </div>
      <div className="min-h-[200px] flex-1">{children}</div>
    </div>
  );
}
