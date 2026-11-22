import { useMemo, useState } from "react";
import { Sidebar } from "@widgets/sidebar";
import { PainelVeiculos } from "@widgets/frota-overview";
import {
  NavegacaoPeriodo,
  PeriodFilter,
  deslocarReferencia,
  intervaloDoPeriodo,
  podeAvancarPeriodo,
  usePeriodoSalvo,
  type PeriodoSalvo,
} from "@features/period-filter";
import { SinoNotificacoes } from "@features/notificacoes";
import { MenuPerfil } from "@features/menu-perfil";
import { PageHeader } from "@shared/ui";
import { formatDateRange } from "@shared/lib";

export function FrotaPage() {
  const periodoSalvo = usePeriodoSalvo("frota");
  if (!periodoSalvo.pronto) return null;
  return <FrotaConteudo periodoSalvo={periodoSalvo} />;
}

function FrotaConteudo({ periodoSalvo }: { periodoSalvo: PeriodoSalvo }) {
  const { periodo, setPeriodo, referencia, setReferencia } = periodoSalvo;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [versaoFrota, setVersaoFrota] = useState(0);
  const intervalo = useMemo(
    () => intervaloDoPeriodo(periodo, referencia),
    [periodo, referencia],
  );

  const navegacao = (
    <NavegacaoPeriodo
      label={formatDateRange(intervalo.dataInicio, intervalo.dataFim)}
      podeAvancar={podeAvancarPeriodo(periodo, referencia)}
      onAnterior={() => setReferencia(deslocarReferencia(periodo, referencia, -1))}
      onSeguinte={() => setReferencia(deslocarReferencia(periodo, referencia, 1))}
      periodo={periodo}
      referencia={referencia}
      onSelecionarData={setReferencia}
    />
  );

  return (
    <div className="min-h-screen">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onVeiculosImportados={() => setVersaoFrota((versao) => versao + 1)}
      />
      <main className="min-w-0 px-4 py-6 sm:px-10 sm:py-8 lg:ml-sidebar">
        <header className="mb-7 flex flex-col gap-5">
          <PageHeader
            title="Frota"
            subtitle="Veículos, tipos, combustíveis e marcas da frota"
            onMenuClick={() => setSidebarOpen(true)}
            perfil={<MenuPerfil />}
            notificacoes={<SinoNotificacoes />}
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3">
            <PeriodFilter value={periodo} onChange={setPeriodo} />
            {navegacao}
          </div>
        </header>

        <PainelVeiculos periodo={intervalo} versao={versaoFrota} />
      </main>
    </div>
  );
}
