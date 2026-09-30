import type { PeriodOption } from "@entities/dashboard-metrics";

interface PeriodFilterProps {
  value: PeriodOption;
  onChange: (period: PeriodOption) => void;
}

const OPTIONS: { value: PeriodOption; label: string }[] = [
  { value: "dia", label: "Dia" },
  { value: "mes", label: "Mês" },
  { value: "ano", label: "Ano" },
];

const OPTION_INACTIVE_CLASS =
  "cursor-pointer rounded-[12px] bg-surface px-3.5 py-2.5 text-sm font-medium text-black";
const OPTION_ACTIVE_CLASS =
  "cursor-pointer rounded-md bg-primary px-3.5 py-2.5 text-sm font-medium text-white";

export function PeriodFilter({ value, onChange }: PeriodFilterProps) {
  return (
    <div
      className="inline-flex gap-2"
      role="tablist"
      aria-label="Filtro de período"
    >
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={option.value === value}
          className={
            option.value === value ? OPTION_ACTIVE_CLASS : OPTION_INACTIVE_CLASS
          }
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
