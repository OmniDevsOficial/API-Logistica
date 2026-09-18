import { Calendar } from "lucide-react";
import type { PeriodOption } from "@entities/dashboard-metrics";
import { BotaoEnviarRelatorio } from "@features/enviar-relatorio/ui/BotaoEnviarRelatorio";
import { FiltrarPorDestinoButton } from "@/features/filtrar-viagens-por-regiao";
import { PeriodFilter } from "@features/period-filter";
import { PageHeader } from "@shared/ui";

interface DashboardTopbarProps {
  period: PeriodOption;
  onPeriodChange: (period: PeriodOption) => void;
  dateRangeLabel: string;
  onMenuClick: () => void;
}

const DATE_RANGE_CLASS =
  "flex items-center gap-2 whitespace-nowrap rounded-md bg-surface px-4 py-2.5 text-sm font-medium text-black";

export function DashboardTopbar({
  period,
  onPeriodChange,
  dateRangeLabel,
  onMenuClick,
}: DashboardTopbarProps) {
  return (
    <header className="mb-7 flex flex-col gap-5">
      <PageHeader title="Dashboard" onMenuClick={onMenuClick} />

      <div className="flex flex-col gap-4 sm:hidden">
        <div className="flex items-center justify-between gap-3">
          <BotaoEnviarRelatorio />

          <PeriodFilter value={period} onChange={onPeriodChange} />
        </div>

        <div className={`${DATE_RANGE_CLASS} w-full justify-center`}>
          <Calendar size={16} />
          <span>{dateRangeLabel}</span>
        </div>
      </div>

      <div className="hidden flex-wrap items-center justify-between gap-3 sm:flex">
        <BotaoEnviarRelatorio />

        <div className="flex flex-wrap items-center gap-3">
          <PeriodFilter value={period} onChange={onPeriodChange} />

          <div className={DATE_RANGE_CLASS}>
            <Calendar size={16} />
            <span>{dateRangeLabel}</span>
          </div>
        </div>
      </div>
      <FiltrarPorDestinoButton />
    </header>
  );
}
