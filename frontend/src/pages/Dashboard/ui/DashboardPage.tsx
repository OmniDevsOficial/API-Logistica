import { useEffect, useMemo, useState } from "react";
import type { PeriodOption } from "@entities/dashboard-metrics";
import type { ResultadoImportacao } from "@features/enviar-relatorio/api/importarManifesto";
import { Sidebar } from "@widgets/sidebar";
import { DashboardTopbar } from "@widgets/dashboard-topbar";
import { DashboardOverview } from "@widgets/dashboard-overview";
import { formatDateRange } from "@shared/lib";
import {
  deslocarReferencia,
  intervaloDoPeriodo,
  podeAvancarPeriodo,
  referenciaDaDataIso,
} from "../lib/intervaloDoPeriodo";
import { lerFiltroSalvo, salvarFiltro } from "../lib/filtroSalvo";
import { useDashboard } from "../model/useDashboard";

const MENSAGEM_CLASS =
  "rounded-md bg-surface p-6 text-center text-sm text-fg-subtle";

export function DashboardPage() {
  const [filtroSalvo] = useState(() => lerFiltroSalvo());
  const [period, setPeriod] = useState<PeriodOption>(
    filtroSalvo?.periodo ?? "mes",
  );
  const [referencia, setReferencia] = useState(
    () => filtroSalvo?.referencia ?? new Date(),
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    salvarFiltro({ periodo: period, referencia });
  }, [period, referencia]);

  const intervalo = useMemo(
    () => intervaloDoPeriodo(period, referencia),
    [period, referencia],
  );
  const { dados, carregando, erro, recarregar } = useDashboard(intervalo);

  function aoImportarManifesto(resultado: ResultadoImportacao) {
    const referenciaImportada = resultado.dataMaisRecente
      ? referenciaDaDataIso(resultado.dataMaisRecente)
      : null;

    if (referenciaImportada) {
      setPeriod("mes");
      setReferencia(referenciaImportada);
    }

    recarregar();
  }

  return (
    <div className="min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="min-w-0 px-4 py-6 sm:px-10 sm:py-8 lg:ml-sidebar">
        <DashboardTopbar
          period={period}
          onPeriodChange={setPeriod}
          dateRangeLabel={formatDateRange(
            intervalo.dataInicio,
            intervalo.dataFim,
          )}
          podeAvancar={podeAvancarPeriodo(period, referencia)}
          onPeriodoAnterior={() =>
            setReferencia(deslocarReferencia(period, referencia, -1))
          }
          onPeriodoSeguinte={() =>
            setReferencia(deslocarReferencia(period, referencia, 1))
          }
          onMenuClick={() => setSidebarOpen(true)}
          onManifestoImportado={aoImportarManifesto}
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
