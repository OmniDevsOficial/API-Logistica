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
  "cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors";
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
      <div className="flex items-center gap-2 rounded-md bg-surface px-4 py-2.5">
        <Search size={16} className="shrink-0 text-fg-muted" />
        <input
          type="text"
          placeholder="Pesquisar"
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
          className="w-full bg-transparent text-sm text-fg placeholder-fg-subtle outline-none sm:w-56"
        />
      </div>

      {/* Tabs de filtro */}
      <div className="flex items-center gap-2">
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
