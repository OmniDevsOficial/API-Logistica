import type { PeriodOption } from "@entities/dashboard-metrics";
import type { ResultadoImportacao } from "@features/enviar-relatorio/api/importarManifesto";
import { BotaoEnviarRelatorio } from "@features/enviar-relatorio/ui/BotaoEnviarRelatorio";
import { BotaoImportarVeiculos } from "@features/importar-veiculos";
import { NavegacaoPeriodo, PeriodFilter } from "@features/period-filter";
import { SinoNotificacoes } from "@features/alerta-utilizacao";
import { PageHeader } from "@shared/ui";

interface DashboardTopbarProps {
  period: PeriodOption;
  onPeriodChange: (period: PeriodOption) => void;
  dateRangeLabel: string;
  podeAvancar: boolean;
  onPeriodoAnterior: () => void;
  onPeriodoSeguinte: () => void;
  referencia: Date;
  onSelecionarData: (data: Date) => void;
  onMenuClick: () => void;
  onManifestoImportado: (resultado: ResultadoImportacao) => void;
}

export function DashboardTopbar({
  period,
  onPeriodChange,
  dateRangeLabel,
  podeAvancar,
  onPeriodoAnterior,
  onPeriodoSeguinte,
  referencia,
  onSelecionarData,
  onMenuClick,
  onManifestoImportado,
}: DashboardTopbarProps) {
  return (
    <header className="mb-7 flex flex-col gap-5">
      <PageHeader
        title="Dashboard"
        onMenuClick={onMenuClick}
        notificacoes={<SinoNotificacoes />}
      />

      <div className="flex flex-col gap-4 sm:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <BotaoEnviarRelatorio onImportado={onManifestoImportado} />
            <BotaoImportarVeiculos variante="secundaria" />
          </div>

          <PeriodFilter value={period} onChange={onPeriodChange} />
        </div>

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
        {/* Importação de veículos ao lado da do manifesto. O operador, que não acessa o dashboard, importa pela tela de Motoristas. */}
        <div className="flex items-center gap-3">
          <BotaoEnviarRelatorio onImportado={onManifestoImportado} />
          <BotaoImportarVeiculos variante="secundaria" />
        </div>

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
