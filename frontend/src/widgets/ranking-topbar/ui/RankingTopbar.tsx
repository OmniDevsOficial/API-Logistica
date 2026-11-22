import type { ReactNode } from "react";
import { Search } from "lucide-react";
import { NavegacaoPeriodo } from "@features/period-filter";
import { SinoNotificacoes } from "@features/notificacoes";
import { MenuPerfil } from "@features/menu-perfil";
import { PageHeader } from "@shared/ui";

interface RankingTopbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  dateRangeLabel: string;
  podeAvancar: boolean;
  onPeriodoAnterior: () => void;
  onPeriodoSeguinte: () => void;
  referencia: Date;
  onSelecionarData: (data: Date) => void;
  onMenuClick: () => void;
  filtro?: ReactNode;
}

export function RankingTopbar({
  search,
  onSearchChange,
  dateRangeLabel,
  podeAvancar,
  onPeriodoAnterior,
  onPeriodoSeguinte,
  referencia,
  onSelecionarData,
  onMenuClick,
  filtro,
}: RankingTopbarProps) {
  return (
    <header className="mb-7 flex flex-col gap-5">
      <PageHeader
        title="Ranking"
        subtitle="Gamificação: pódio e lista de motoristas do mês"
        onMenuClick={onMenuClick}
        perfil={<MenuPerfil />}
        notificacoes={<SinoNotificacoes />}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 rounded-md bg-surface px-4 py-2.5">
          <Search size={16} className="shrink-0 text-fg-muted" />
          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Pesquisar"
            aria-label="Pesquisar motoristas"
            className="w-full bg-transparent text-sm text-fg placeholder-fg-subtle outline-none sm:w-56"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {filtro}
          <NavegacaoPeriodo
            label={dateRangeLabel}
            podeAvancar={podeAvancar}
            onAnterior={onPeriodoAnterior}
            onSeguinte={onPeriodoSeguinte}
            periodo="mes"
            referencia={referencia}
            onSelecionarData={onSelecionarData}
          />
        </div>
      </div>
    </header>
  );
}
