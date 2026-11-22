import type { PeriodOption } from "@entities/dashboard-metrics";
import { NavegacaoPeriodo, PeriodFilter } from "@features/period-filter";
import { SinoNotificacoes } from "@features/notificacoes";
import { PageHeader } from "@shared/ui";
import { MenuPerfil } from "@features/menu-perfil";
import { GuiasDashboard, type GuiaDashboard } from "./GuiasDashboard";

interface DashboardTopbarProps {
  guia: GuiaDashboard;
  onGuiaChange: (guia: GuiaDashboard) => void;
  period: PeriodOption;
  onPeriodChange: (period: PeriodOption) => void;
  dateRangeLabel: string;
  podeAvancar: boolean;
  onPeriodoAnterior: () => void;
  onPeriodoSeguinte: () => void;
  referencia: Date;
  onSelecionarData: (data: Date) => void;
  onMenuClick: () => void;
}

export function DashboardTopbar({
  guia,
  onGuiaChange,
  period,
  onPeriodChange,
  dateRangeLabel,
  podeAvancar,
  onPeriodoAnterior,
  onPeriodoSeguinte,
  referencia,
  onSelecionarData,
  onMenuClick,
}: DashboardTopbarProps) {
  return (
    <header className="mb-7 flex flex-col gap-5">
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral de viagens, motoristas e veículos"
        onMenuClick={onMenuClick}
        perfil={<MenuPerfil />}
        notificacoes={<SinoNotificacoes />}
      />

      <div className="flex flex-col gap-4 sm:hidden">
        <GuiasDashboard guia={guia} onGuiaChange={onGuiaChange} />

        <PeriodFilter value={period} onChange={onPeriodChange} />

        <NavegacaoPeriodo
          label={dateRangeLabel}
          podeAvancar={podeAvancar}
          onAnterior={onPeriodoAnterior}
          onSeguinte={onPeriodoSeguinte}
          periodo={period}
          referencia={referencia}
          onSelecionarData={onSelecionarData}
          className="w-full justify-center"
        />
      </div>

      <div className="hidden flex-wrap items-center justify-between gap-3 sm:flex">
        <GuiasDashboard guia={guia} onGuiaChange={onGuiaChange} />

        <div className="flex flex-wrap items-center gap-3">
          <PeriodFilter value={period} onChange={onPeriodChange} />

          <NavegacaoPeriodo
            label={dateRangeLabel}
            podeAvancar={podeAvancar}
            onAnterior={onPeriodoAnterior}
            onSeguinte={onPeriodoSeguinte}
            periodo={period}
            referencia={referencia}
            onSelecionarData={onSelecionarData}
          />
        </div>
      </div>
    </header>
  );
}
