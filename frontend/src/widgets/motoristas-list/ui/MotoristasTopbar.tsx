import { ArrowDownAZ, ArrowUpAZ, Calendar } from "lucide-react";
import { PageHeader } from "@shared/ui";

interface MotoristasTopbarProps {
  periodo: string;
  ordem: "asc" | "desc";
  onPeriodoChange: (periodo: string) => void;
  onOrdemChange: (ordem: "asc" | "desc") => void;
  onMenuClick: () => void;
}

const PILL_CLASS =
  "flex items-center gap-2 whitespace-nowrap rounded-md bg-surface px-4 py-2.5 text-sm font-medium text-black";

export function MotoristasTopbar({
  periodo,
  ordem,
  onPeriodoChange,
  onOrdemChange,
  onMenuClick,
}: MotoristasTopbarProps) {
  return (
    <header className="mb-7 flex flex-col gap-5">
      <PageHeader title="Motoristas" onMenuClick={onMenuClick} />

      <div className="flex flex-wrap items-center gap-3">
        <div className={PILL_CLASS}>
          <Calendar size={16} />

          <select
            value={periodo}
            onChange={(event) => onPeriodoChange(event.target.value)}
            className="bg-transparent focus:outline-none"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => onOrdemChange(ordem === "desc" ? "asc" : "desc")}
          className={PILL_CLASS}
        >
          {ordem === "desc" ? (
            <ArrowDownAZ size={16} />
          ) : (
            <ArrowUpAZ size={16} />
          )}

          {ordem === "desc" ? "Maior utilização" : "Menor utilização"}
        </button>
      </div>
    </header>
  );
}
