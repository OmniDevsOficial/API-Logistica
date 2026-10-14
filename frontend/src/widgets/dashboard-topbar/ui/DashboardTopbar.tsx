import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import type { PeriodOption } from "@entities/dashboard-metrics";
import type { ResultadoImportacao } from "@features/enviar-relatorio/api/importarManifesto";
import { BotaoEnviarRelatorio } from "@features/enviar-relatorio/ui/BotaoEnviarRelatorio";
import { PeriodFilter } from "@features/period-filter";
import { PageHeader } from "@shared/ui";

interface DashboardTopbarProps {
  period: PeriodOption;
  onPeriodChange: (period: PeriodOption) => void;
  dateRangeLabel: string;
  podeAvancar: boolean;
  onPeriodoAnterior: () => void;
  onPeriodoSeguinte: () => void;
  onMenuClick: () => void;
  onManifestoImportado: (resultado: ResultadoImportacao) => void;
}

const DATE_RANGE_CLASS =
  "flex items-center gap-2 whitespace-nowrap rounded-md bg-surface px-4 py-2.5 text-sm font-medium text-black";
const NAV_BUTTON_CLASS =
  "flex cursor-pointer items-center text-fg-muted transition-colors duration-150 hover:text-fg disabled:cursor-not-allowed disabled:opacity-40";

interface NavegacaoPeriodoProps {
  label: string;
  podeAvancar: boolean;
  onAnterior: () => void;
  onSeguinte: () => void;
  className?: string;
}

function NavegacaoPeriodo({
  label,
  podeAvancar,
  onAnterior,
  onSeguinte,
  className,
}: NavegacaoPeriodoProps) {
  return (
    <div className={`${DATE_RANGE_CLASS} ${className ?? ""}`}>
      <button
        type="button"
        className={NAV_BUTTON_CLASS}
        onClick={onAnterior}
        aria-label="Período anterior"
      >
        <ChevronLeft size={16} />
      </button>

      <Calendar size={16} />
      <span>{label}</span>

      <button
        type="button"
        className={NAV_BUTTON_CLASS}
        onClick={onSeguinte}
        disabled={!podeAvancar}
        aria-label="Período seguinte"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export function DashboardTopbar({
  period,
  onPeriodChange,
  dateRangeLabel,
  podeAvancar,
  onPeriodoAnterior,
  onPeriodoSeguinte,
  onMenuClick,
  onManifestoImportado,
}: DashboardTopbarProps) {
  return (
    <header className="mb-7 flex flex-col gap-5">
      <PageHeader title="Dashboard" onMenuClick={onMenuClick} />

      <div className="flex flex-col gap-4 sm:hidden">
        <div className="flex items-center justify-between gap-3">
          <BotaoEnviarRelatorio onImportado={onManifestoImportado} />

          <PeriodFilter value={period} onChange={onPeriodChange} />
        </div>

        <NavegacaoPeriodo
          label={dateRangeLabel}
          podeAvancar={podeAvancar}
          onAnterior={onPeriodoAnterior}
          onSeguinte={onPeriodoSeguinte}
          className="w-full justify-center"
        />
      </div>

      <div className="hidden flex-wrap items-center justify-between gap-3 sm:flex">
        <BotaoEnviarRelatorio onImportado={onManifestoImportado} />

        <div className="flex flex-wrap items-center gap-3">
          <PeriodFilter value={period} onChange={onPeriodChange} />

          <NavegacaoPeriodo
            label={dateRangeLabel}
            podeAvancar={podeAvancar}
            onAnterior={onPeriodoAnterior}
            onSeguinte={onPeriodoSeguinte}
          />
        </div>
      </div>
    </header>
  );
}
