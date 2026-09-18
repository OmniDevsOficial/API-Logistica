import { Bell, Calendar, ListFilter, Menu, Moon, Search, User } from "lucide-react";

interface ViagensTopbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  periodoLabel: string;
  onMenuClick: () => void;
}

const ICON_BUTTON_CLASS =
  "flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-surface text-black hover:text-fg";

const PILL_CLASS =
  "flex items-center gap-2 whitespace-nowrap rounded-md bg-surface px-4 py-2.5 text-sm font-medium text-black";

export function ViagensTopbar({
  search,
  onSearchChange,
  periodoLabel,
  onMenuClick,
}: ViagensTopbarProps) {
  return (
    <header className="mb-7 flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className={`${ICON_BUTTON_CLASS} lg:hidden`}
            aria-label="Abrir menu"
            onClick={onMenuClick}
          >
            <Menu size={18} />
          </button>
          <h1 className="text-[28px] font-semibold text-fg">Viagens</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className={ICON_BUTTON_CLASS}
            aria-label="Alternar tema"
          >
            <Moon size={18} />
          </button>
          <button
            type="button"
            className={ICON_BUTTON_CLASS}
            aria-label="Notificações"
          >
            <Bell size={18} />
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-border text-fg-muted">
            <User size={18} />
          </div>
        </div>
      </div>

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

        <button type="button" className={PILL_CLASS}>
          <ListFilter size={16} />
          Filtros
        </button>

        <div className={PILL_CLASS}>
          <Calendar size={16} />
          {periodoLabel}
        </div>
      </div>
    </header>
  );
}
