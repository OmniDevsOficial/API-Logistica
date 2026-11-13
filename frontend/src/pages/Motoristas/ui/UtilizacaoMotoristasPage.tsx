import { useMemo, useState } from "react";
import { Sidebar } from "@widgets/sidebar";
import { MotoristasTopbar, MotoristasList } from "@/widgets/motoristas-list";
import { SinoNotificacoes } from "@features/alerta-utilizacao";
import { useMotoristasUtilizacao } from "../model/useMotoristasUtilizacao";
import { intervaloDoPeriodo } from "../lib/intervaloDoPeriodo";

export function UtilizacaoMotoristasPage() {
  const [periodo, setPeriodo] = useState("30d");
  const [ordem, setOrdem] = useState<"asc" | "desc">("desc");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const intervalo = useMemo(() => intervaloDoPeriodo(periodo), [periodo]);
  const { motoristas, carregando, erro } = useMotoristasUtilizacao(
    periodo,
    ordem,
  );

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="min-w-0 px-4 py-6 sm:px-10 sm:py-8 lg:ml-sidebar lg:flex lg:h-full lg:min-h-0 lg:flex-col">
        <MotoristasTopbar
          periodo={periodo}
          ordem={ordem}
          onPeriodoChange={setPeriodo}
          onOrdemChange={setOrdem}
          onMenuClick={() => setSidebarOpen(true)}
          notificacoes={
            <SinoNotificacoes
              dataInicio={intervalo.dataInicio}
              dataFim={intervalo.dataFim}
            />
          }
        />

        <div className="lg:min-h-0 lg:flex-1">
          {erro ? (
            <p role="alert" className="rounded-md bg-surface p-6 text-center text-sm text-fg-subtle">
              {erro}
            </p>
          ) : carregando ? (
            <p role="status" className="rounded-md bg-surface p-6 text-center text-sm text-fg-subtle">
              Carregando motoristas...
            </p>
          ) : (
            <MotoristasList motoristas={motoristas} />
          )}
        </div>
      </main>
    </div>
  );
}
