import { useState } from "react";
import type { PeriodOption } from "@entities/dashboard-metrics";
import { Sidebar } from "@widgets/sidebar";
import { DashboardTopbar } from "@widgets/dashboard-topbar";
import { DashboardOverview } from "@widgets/dashboard-overview";
import { formatDateRange } from "@shared/lib";
import { useDashboard } from "../model/useDashboard";

const MENSAGEM_CLASS =
  "rounded-md bg-surface p-6 text-center text-sm text-fg-subtle";

export function DashboardPage() {
  const [period, setPeriod] = useState<PeriodOption>("mes");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { dados, carregando, erro, recarregar } = useDashboard(period);

  return (
    <div className="min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="min-w-0 px-4 py-6 sm:px-10 sm:py-8 lg:ml-sidebar">
        <DashboardTopbar
          period={period}
          onPeriodChange={setPeriod}
          dateRangeLabel={
            dados ? formatDateRange(dados.periodo.inicio, dados.periodo.fim) : ""
          }
          onMenuClick={() => setSidebarOpen(true)}
          onManifestoImportado={recarregar}
        />

        {erro ? (
          <p role="alert" className={MENSAGEM_CLASS}>
            {erro}
          </p>
        ) : carregando ? (
          <p role="status" className={MENSAGEM_CLASS}>
            Carregando dashboard...
          </p>
        ) : (
          dados && (
            <div className="flex flex-col gap-6">
              {dados.status === "SEM_DADOS" && (
                <p role="status" className={MENSAGEM_CLASS}>
                  Nenhuma viagem importada no período selecionado.
                </p>
              )}

              <DashboardOverview data={dados} />
            </div>
          )
        )}
      </main>
    </div>
  );
}
