import { useEffect, useMemo, useState } from "react";
import type { PeriodOption } from "@entities/dashboard-metrics";
import {
  getViagensData,
  type ViagensData,
  type Viagem,
} from "@entities/viagem";
import { Sidebar } from "@widgets/sidebar";
import { ViagensTopbar } from "@widgets/viagens-topbar";
import { ViagensList } from "@widgets/viagens-list";
import { ViagensRanking } from "@widgets/viagens-ranking";
import type { FiltroViagens } from "@widgets/viagens-topbar";
import { filtroVazio } from "@/widgets/viagens-topbar/model/types";
import {
  deslocarReferencia,
  intervaloDoPeriodo,
  podeAvancarPeriodo,
} from "@features/period-filter";
import { formatDateRange } from "@shared/lib";
import { viagensNoPeriodo } from "../lib/viagensNoPeriodo";

export function ViagensPage() {
  const [data, setData] = useState<ViagensData | null>(null);
  const [erro, setErro] = useState(false);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [period, setPeriod] = useState<PeriodOption>("mes");
  const [referencia, setReferencia] = useState(() => new Date());
  const intervalo = useMemo(
    () => intervaloDoPeriodo(period, referencia),
    [period, referencia],
  );
  const [filtroModal, setFiltroModal] = useState<FiltroViagens>(() => ({
    ...filtroVazio,
    status: [...filtroVazio.status],
  }));

  // null = modal ainda não aplicou nenhum filtro -> usa a lista completa da API
  const [viagensFiltradasPorModal, setViagensFiltradasPorModal] = useState<
    Viagem[] | null
  >(null);

  useEffect(() => {
    let isCurrent = true;
    getViagensData().then((result) => {
      if (isCurrent) setData(result);
    }).catch(() => { if (isCurrent) setErro(true); });
    return () => {
      isCurrent = false;
    };
  }, []);

  // Resultado do modal
  const viagensBase = useMemo(
    () => viagensNoPeriodo(viagensFiltradasPorModal ?? data?.viagens ?? [], intervalo),
    [viagensFiltradasPorModal, data, intervalo],
  );
  const viagensDoPeriodo = useMemo(
    () => viagensNoPeriodo(data?.viagens ?? [], intervalo),
    [data, intervalo],
  );

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
    <div className="min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="min-w-0 px-4 py-6 sm:px-10 sm:py-8 lg:ml-sidebar lg:flex lg:flex-col">
        <ViagensTopbar
          search={search}
          onSearchChange={setSearch}
          period={period}
          onPeriodChange={setPeriod}
          dateRangeLabel={formatDateRange(intervalo.dataInicio, intervalo.dataFim)}
          podeAvancar={podeAvancarPeriodo(period, referencia)}
          onPeriodoAnterior={() => setReferencia(deslocarReferencia(period, referencia, -1))}
          onPeriodoSeguinte={() => setReferencia(deslocarReferencia(period, referencia, 1))}
          onMenuClick={() => setSidebarOpen(true)}
          onFiltroAplicado={setViagensFiltradasPorModal}
          onFiltroLimpo={() => {
            setViagensFiltradasPorModal(null);
            setFiltroModal({
              ...filtroVazio,
              status: [...filtroVazio.status],
            });
          }}
          onFiltroModalChange={setFiltroModal}
          filtroModal={filtroModal}
        />
        {!data && !erro && <p className="py-8 text-center text-sm text-fg-subtle">Carregando viagens…</p>}
        {erro && <p className="py-8 text-center text-sm text-red-600">Não foi possível carregar as viagens.</p>}
        {data && (
          <div className="grid grid-cols-1 gap-6 items-start lg:grid-cols-[2fr_1fr]">
            <ViagensList viagens={viagensFiltradas} />
            {/* Ranking mostra tudo, não é afetado pelos filtros de cima */}
            <ViagensRanking viagens={viagensDoPeriodo} />
          </div>
        )}
      </main>
    </div>
  );
}
