import { Bell, Menu, Moon, User } from "lucide-react";

export interface PageHeaderProps {
  title: string;
  onMenuClick: () => void;
}

const ICON_BUTTON_CLASS =
  "flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-surface text-black hover:text-fg";

export function PageHeader({ title, onMenuClick }: PageHeaderProps) {
  return (
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
        <h1 className="text-[28px] font-semibold text-fg">{title}</h1>
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
  );
}
