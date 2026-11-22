import type { ReactNode } from "react";
import { Bell, Menu, Moon, Sun, User } from "lucide-react";
import { alternarTema, useTema } from "@shared/lib";

export interface PageHeaderProps {
  title: string;
  subtitle: string;
  onMenuClick: () => void;
  notificacoes?: ReactNode;
  /** Ações da página (ex.: botão de importação), exibidas antes dos ícones. */
  acoes?: ReactNode;
  perfil?: ReactNode;
}

const ICON_BUTTON_CLASS =
  "flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-surface text-fg hover:text-fg-muted";

export function PageHeader({ title, subtitle, onMenuClick, notificacoes, acoes, perfil }: PageHeaderProps) {
  const escuro = useTema() === "escuro";

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className={`${ICON_BUTTON_CLASS} lg:hidden`}
          aria-label="Abrir menu"
          onClick={onMenuClick}
        >
          <Menu size={18} />
        </button>
        <div className="min-w-0 truncate">
        <h1 className="min-w-0 truncate text-2xl font-semibold text-fg sm:text-[28px]">{title}</h1>
        
        <p className="text-fg-subtle">{subtitle}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {acoes && <div className="hidden sm:block">{acoes}</div>}
        <button
          type="button"
          className={ICON_BUTTON_CLASS}
          aria-label={escuro ? "Ativar modo claro" : "Ativar modo escuro"}
          title={escuro ? "Modo claro" : "Modo escuro"}
          onClick={alternarTema}
        >
          {escuro ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        {notificacoes ?? (
          <button
            type="button"
            className={ICON_BUTTON_CLASS}
            aria-label="Notificações"
          >
            <Bell size={18} />
          </button>
        )}
        {perfil ?? (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-border text-fg-muted">
            <User size={18} />
          </div>
        )}
      </div>
    </div>
  );
}
