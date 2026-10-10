import { Calendar, Search } from "lucide-react";
import { PageHeader } from "@shared/ui";
import { FiltrarViagensButton } from "./FiltrarViagensButton";
import type { Viagem } from "@/entities/viagem";
import type { FiltroViagens } from "../model/types";

interface ViagensTopbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  periodoLabel: string;
  onMenuClick: () => void;
  onFiltroAplicado: (viagens: Viagem[]) => void;
  onFiltroLimpo: () => void;
  filtroModal: FiltroViagens;
  onFiltroModalChange: (filtro: FiltroViagens) => void;
}

const PILL_CLASS =
  "flex items-center gap-2 whitespace-nowrap rounded-md bg-surface px-4 py-2.5 text-sm font-medium text-black";

export function ViagensTopbar({
  search,
  onSearchChange,
  periodoLabel,
  onMenuClick,
  onFiltroAplicado,
  onFiltroLimpo,
  filtroModal,
  onFiltroModalChange,
}: ViagensTopbarProps) {
  return (
    <header className="mb-7 flex flex-col gap-5">
      <PageHeader title="Viagens" onMenuClick={onMenuClick} />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-fg-subtle"
          />
          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Pesquisar"
            className="w-full rounded-md bg-surface py-2.5 pr-4 pl-11 text-sm text-fg placeholder:text-fg-subtle focus:outline-none"
          />
        </div>

        {/* Botão de filtro */}
        <FiltrarViagensButton
          onFiltroAplicado={onFiltroAplicado}
          onFiltroLimpo={onFiltroLimpo}
          filtroModal={filtroModal}
          onFiltroModalChange={onFiltroModalChange}
          buttonClassName={PILL_CLASS}
        />

        <div className={PILL_CLASS}>
          <Calendar size={16} />
          {periodoLabel}
        </div>
      </div>
    </header>
  );
}
