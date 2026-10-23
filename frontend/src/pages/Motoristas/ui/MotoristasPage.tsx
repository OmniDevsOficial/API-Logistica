import { useMemo, useState } from "react";
import { atualizarStatusMotorista } from "@entities/motorista";
import type { StatusEquipe } from "@entities/motorista";
import { Sidebar } from "@widgets/sidebar";
import { SinoNotificacoes } from "@features/alerta-utilizacao";
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
  const [statusSalvando, setStatusSalvando] = useState<number | null>(null);
  const [erroStatus, setErroStatus] = useState<string | null>(null);

  const { dados, carregando, erro, recarregar } =
    useEquipeMotoristas(filtroStatus);
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

  async function alterarStatus(id: number, novoStatus: StatusEquipe) {
    setStatusSalvando(id);
    setErroStatus(null);

    try {
      await atualizarStatusMotorista(id, novoStatus);
      recarregar();
    } catch (erroAtualizacao) {
      setErroStatus(
        erroAtualizacao instanceof Error
          ? erroAtualizacao.message
          : "Não foi possível atualizar o status do motorista.",
      );
    } finally {
      setStatusSalvando(null);
    }
  }

  return (
    <div className="min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="min-w-0 px-4 py-6 sm:px-10 sm:py-8 lg:ml-sidebar">
        <header className="mb-7 flex flex-col gap-5">
          <PageHeader
            title="Motoristas"
            onMenuClick={() => setSidebarOpen(true)}
            notificacoes={<SinoNotificacoes />}
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

            {erroStatus && (
              <p
                role="alert"
                className="rounded-md bg-red-500/10 px-4 py-3 text-sm text-red-500"
              >
                {erroStatus}
              </p>
            )}

            <EquipeTabela
              motoristas={motoristasFiltrados}
              rentabilidades={rentabilidades}
              chaveNomeMotorista={chaveNomeMotorista}
              statusSalvando={statusSalvando}
              onStatusChange={alterarStatus}
            />
          </div>
        ) : null}
      </main>
    </div>
  );
}
