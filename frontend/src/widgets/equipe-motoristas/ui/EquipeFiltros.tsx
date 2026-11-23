import { Search } from "lucide-react";
import type { StatusEquipe } from "@entities/motorista";

type FiltroStatus = StatusEquipe | null;

interface EquipeFiltrosProps {
  busca: string;
  onBuscaChange: (valor: string) => void;
  filtroAtivo: FiltroStatus;
  onFiltroChange: (filtro: FiltroStatus) => void;
}

interface OpcaoFiltro {
  label: string;
  valor: FiltroStatus;
}

const OPCOES_FILTRO: OpcaoFiltro[] = [
  { label: "Todos", valor: null },
  { label: "Disponíveis", valor: "disponivel" },
  { label: "Em viagem", valor: "em_viagem" },
  { label: "Indisponíveis", valor: "indisponivel" },
];

const TAB_BASE =
  "cursor-pointer whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-medium transition-colors";
const TAB_ACTIVE = `${TAB_BASE} bg-primary text-white`;
const TAB_INACTIVE = `${TAB_BASE} bg-surface text-fg hover:bg-border`;

export function EquipeFiltros({
  busca,
  onBuscaChange,
  filtroAtivo,
  onFiltroChange,
}: EquipeFiltrosProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Campo de busca */}
      <div className="flex w-full items-center gap-2 rounded-xl bg-surface px-4 py-3 sm:max-w-md">
        <Search size={16} className="shrink-0 text-fg-muted" />
        <input
          type="text"
          placeholder="Pesquisar"
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
          className="w-full min-w-0 bg-transparent text-sm text-fg placeholder-fg-subtle outline-none"
        />
      </div>

      {/* Tabs de filtro */}
      <div className="flex flex-wrap items-center gap-2">
        {OPCOES_FILTRO.map(({ label, valor }) => (
          <button
            key={label}
            type="button"
            onClick={() => onFiltroChange(valor)}
            className={filtroAtivo === valor ? TAB_ACTIVE : TAB_INACTIVE}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
