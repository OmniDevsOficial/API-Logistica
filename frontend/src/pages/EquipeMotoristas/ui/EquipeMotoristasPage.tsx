import { useMemo, useState } from "react";
import type { StatusEquipe } from "@entities/motorista";
import { getEquipeMotoristasData } from "@entities/motorista";
import { Sidebar } from "@widgets/sidebar";
import { PageHeader } from "@shared/ui";
import {
  EquipeStatCards,
  EquipeFiltros,
  EquipeTabela,
} from "@widgets/equipe-motoristas";

export function EquipeMotoristasPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<StatusEquipe | null>(null);

  const dados = getEquipeMotoristasData(filtroStatus);

  const motoristasFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return dados.motoristas;
    return dados.motoristas.filter(
      (m) =>
        m.nome.toLowerCase().includes(termo) ||
        m.localizacao.toLowerCase().includes(termo) ||
        m.veiculo.toLowerCase().includes(termo),
    );
  }, [dados.motoristas, busca]);

  return (
    <div className="min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="min-w-0 px-4 py-6 sm:px-10 sm:py-8 lg:ml-sidebar">
        <header className="mb-7 flex flex-col gap-5">
          <PageHeader
            title="Dashboard"
            onMenuClick={() => setSidebarOpen(true)}
          />

          <EquipeFiltros
            busca={busca}
            onBuscaChange={setBusca}
            filtroAtivo={filtroStatus}
            onFiltroChange={setFiltroStatus}
          />
        </header>

        <div className="flex flex-col gap-6">
          <EquipeStatCards
            totalMotoristas={dados.totalMotoristas}
            disponiveis={dados.disponiveis}
            emViagem={dados.emViagem}
            indisponiveis={dados.indisponiveis}
          />

          <div>
            <h2 className="mb-4 text-lg font-semibold text-fg">
              Equipe de motoristas
            </h2>
            <EquipeTabela motoristas={motoristasFiltrados} />
          </div>
        </div>
      </main>
    </div>
  );
}
