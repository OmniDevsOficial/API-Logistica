import { Search } from "lucide-react";
import type { PeriodOption } from "@entities/dashboard-metrics";
import { NavegacaoPeriodo, PeriodFilter } from "@features/period-filter";
import { PageHeader } from "@shared/ui";
import { FiltrarViagensButton } from "./FiltrarViagensButton";
import type { Viagem } from "@/entities/viagem";
import type { FiltroViagens } from "../model/types";

interface ViagensTopbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  period: PeriodOption;
  onPeriodChange: (period: PeriodOption) => void;
  dateRangeLabel: string;
  podeAvancar: boolean;
  onPeriodoAnterior: () => void;
  onPeriodoSeguinte: () => void;
  onMenuClick: () => void;
  onFiltroAplicado: (viagens: Viagem[]) => void;
  onFiltroLimpo: () => void;
  filtroModal: FiltroViagens;
  onFiltroModalChange: (filtro: FiltroViagens) => void;
}

const PILL_CLASS =
  "flex items-center gap-2 whitespace-nowrap rounded-md bg-surface px-4 py-2.5 text-sm font-medium text-black";

export function ViagensTopbar({
  search,
  onSearchChange,
  period,
  onPeriodChange,
  dateRangeLabel,
  podeAvancar,
  onPeriodoAnterior,
  onPeriodoSeguinte,
  onMenuClick,
  onFiltroAplicado,
  onFiltroLimpo,
  filtroModal,
  onFiltroModalChange,
}: ViagensTopbarProps) {
  return (
    <header className="mb-7 flex flex-col gap-5">
      <PageHeader title="Viagens" onMenuClick={onMenuClick} />

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 rounded-md bg-surface px-4 py-2.5">
          <Search size={16} className="shrink-0 text-fg-muted" />
          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Pesquisar"
            className="w-full bg-transparent text-sm text-fg placeholder-fg-subtle outline-none sm:w-56"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <FiltrarViagensButton
            onFiltroAplicado={onFiltroAplicado}
            onFiltroLimpo={onFiltroLimpo}
            filtroModal={filtroModal}
            onFiltroModalChange={onFiltroModalChange}
            buttonClassName={PILL_CLASS}
          />

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
