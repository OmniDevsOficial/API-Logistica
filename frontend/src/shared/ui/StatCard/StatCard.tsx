import { TrendingUp } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: string;
  caption?: string;
  trendLabel?: string;
  highlighted?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  caption,
  trendLabel,
  highlighted,
  className,
}: StatCardProps) {
  const cardClassName = [
    "flex flex-col gap-2.5 rounded-md p-6",
    highlighted ? "bg-primary" : "bg-surface",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClassName}>
      <span
        className={`text-sm font-semibold ${highlighted ? "text-white/85" : "text-fg-muted"}`}
      >
        {title}
      </span>
      <span
        className={`text-[28px] font-bold tracking-[-0.5px] ${highlighted ? "text-white" : "text-fg"}`}
      >
        {value}
      </span>
      {trendLabel && (
        <span className="inline-flex w-fit items-center gap-1 text-[13px] font-semibold text-trend">
          <TrendingUp size={14} strokeWidth={2.5} />
          {trendLabel}
        </span>
      )}
      {caption && !trendLabel && (
        <span className="text-[13px] text-fg-subtle">{caption}</span>
      )}
    </div>
  );
}
