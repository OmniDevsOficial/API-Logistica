import { useEffect, useMemo, useState } from "react";
import { getViagensData, type ViagensData } from "@entities/viagem";
import { Sidebar } from "@widgets/sidebar";
import { ViagensTopbar } from "@widgets/viagens-topbar";
import { ViagensList } from "@widgets/viagens-list";
import { ViagensRanking } from "@widgets/viagens-ranking";

export function ViagensPage() {
  const [data, setData] = useState<ViagensData | null>(null);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    getViagensData().then((result) => {
      if (isCurrent) setData(result);
    });
    return () => {
      isCurrent = false;
    };
  }, []);

  const viagensFiltradas = useMemo(() => {
    if (!data) return [];
    const termo = search.trim().toLowerCase();
    if (!termo) return data.viagens;
    return data.viagens.filter(
      (viagem) =>
        viagem.origem.toLowerCase().includes(termo) ||
        viagem.destino.toLowerCase().includes(termo),
    );
  }, [data, search]);

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="min-w-0 px-4 py-6 sm:px-10 sm:py-8 lg:ml-sidebar lg:flex lg:h-full lg:min-h-0 lg:flex-col">
        <ViagensTopbar
          search={search}
          onSearchChange={setSearch}
          periodoLabel={data?.periodoLabel ?? ""}
          onMenuClick={() => setSidebarOpen(true)}
        />
        {data && (
          <div className="grid grid-cols-1 gap-6 lg:min-h-0 lg:flex-1 lg:grid-cols-[2fr_1fr]">
            <ViagensList viagens={viagensFiltradas} />
            <ViagensRanking viagens={data.viagens} />
          </div>
        )}
      </main>
    </div>
  );
}
