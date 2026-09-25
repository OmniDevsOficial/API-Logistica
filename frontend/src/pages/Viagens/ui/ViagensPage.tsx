import { useEffect, useMemo, useState } from "react";
import {
  getViagensData,
  type ViagensData,
  type Viagem,
} from "@entities/viagem";
import { Sidebar } from "@widgets/sidebar";
import { ViagensTopbar } from "@widgets/viagens-topbar";
import { ViagensList } from "@widgets/viagens-list";
import { ViagensRanking } from "@widgets/viagens-ranking";

export function ViagensPage() {
  const [data, setData] = useState<ViagensData | null>(null);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // null = modal ainda não aplicou nenhum filtro -> usa a lista completa da API
  const [viagensFiltradasPorModal, setViagensFiltradasPorModal] =
    useState<Viagem[] | null>(null);

  useEffect(() => {
    let isCurrent = true;
    getViagensData().then((result) => {
      if (isCurrent) setData(result);
    });
    return () => {
      isCurrent = false;
    };
  }, []);

  // Resultado do modal (se já rodou) ou tudo que veio da API
  const viagensBase = viagensFiltradasPorModal ?? data?.viagens ?? [];

  // Aqui é a Busca por texto do filtro
  const viagensFiltradas = useMemo(() => {
    const termo = search.trim().toLowerCase();
    if (!termo) return viagensBase;
    return viagensBase.filter(
      (viagem) =>
        viagem.origem.toLowerCase().includes(termo) ||
        viagem.destino.toLowerCase().includes(termo),
    );
  }, [viagensBase, search]);

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="min-w-0 px-4 py-6 sm:px-10 sm:py-8 lg:ml-sidebar lg:flex lg:h-full lg:min-h-0 lg:flex-col">
        <ViagensTopbar
          search={search}
          onSearchChange={setSearch}
          periodoLabel={data?.periodoLabel ?? ""}
          onMenuClick={() => setSidebarOpen(true)}
          onFiltroAplicado={setViagensFiltradasPorModal}
          onFiltroLimpo={() => setViagensFiltradasPorModal(null)}
        />
        {data && (
          <div className="grid grid-cols-1 gap-6 lg:min-h-0 lg:flex-1 lg:grid-cols-[2fr_1fr]">
            <ViagensList viagens={viagensFiltradas} />
            {/* Ranking mostra tudo, não é afetado pelos filtros de cima */}
            <ViagensRanking viagens={data.viagens} />
          </div>
        )}
      </main>
    </div>
  );
}
