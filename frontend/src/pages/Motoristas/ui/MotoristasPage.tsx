import { useMemo, useState } from "react";
import type { StatusEquipe } from "@entities/motorista";
import { Sidebar } from "@widgets/sidebar";
import { PageHeader } from "@shared/ui";
import {
  EquipeStatCards,
  EquipeFiltros,
  EquipeTabela,
} from "@widgets/equipe-motoristas";
import { useEquipeMotoristas } from "../model/useEquipeMotoristas";
import {
  chaveNomeMotorista,
  useRentabilidadeMotoristas,
} from "../model/useRentabilidadeMotoristas";

const ESTADO_LISTA =
  "rounded-md bg-surface p-6 text-center text-sm text-fg-subtle";

export function MotoristasPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<StatusEquipe | null>(null);

  const { dados, carregando, erro } = useEquipeMotoristas(filtroStatus);
  const rentabilidades = useRentabilidadeMotoristas();

  const motoristasFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const motoristas = dados?.motoristas ?? [];
    if (!termo) return motoristas;
    return motoristas.filter(
      (m) =>
        m.nome.toLowerCase().includes(termo) ||
        m.localizacao.toLowerCase().includes(termo) ||
        m.veiculo.toLowerCase().includes(termo),
    );
  }, [dados, busca]);

  return (
    <div className="min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="min-w-0 px-4 py-6 sm:px-10 sm:py-8 lg:ml-sidebar">
        <header className="mb-7 flex flex-col gap-5">
          <PageHeader
            title="Motoristas"
            onMenuClick={() => setSidebarOpen(true)}
          />

          <EquipeFiltros
            busca={busca}
            onBuscaChange={setBusca}
            filtroAtivo={filtroStatus}
            onFiltroChange={setFiltroStatus}
          />
        </header>

        {erro ? (
          <p role="alert" className={ESTADO_LISTA}>
            {erro}
          </p>
        ) : carregando ? (
          <p role="status" className={ESTADO_LISTA}>
            Carregando motoristas...
          </p>
        ) : dados ? (
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
              <EquipeTabela
                motoristas={motoristasFiltrados}
                rentabilidades={rentabilidades}
                chaveNomeMotorista={chaveNomeMotorista}
              />
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
