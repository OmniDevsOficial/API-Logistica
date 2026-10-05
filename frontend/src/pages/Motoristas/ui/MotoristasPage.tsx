import { useState } from "react";
import { Sidebar } from "@widgets/sidebar";
import { MotoristasTopbar, MotoristasList } from "@/widgets/motoristas-list";
import { useMotoristasUtilizacao } from "../model/useMotoristasUtilizacao";

export function MotoristasPage() {
  const [periodo, setPeriodo] = useState("30d");
  const [ordem, setOrdem] = useState<"asc" | "desc">("desc");
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
