import { NavLink } from "react-router-dom";
import type { SecaoAdministracao } from "../model/types";

const ITEM_BASE =
  "flex shrink-0 items-center gap-3 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:rounded-md lg:px-3 lg:py-3";
const ITEM_INATIVO = `${ITEM_BASE} text-fg-muted hover:bg-background hover:text-fg`;
const ITEM_ATIVO = `${ITEM_BASE} bg-primary/10 font-semibold text-primary dark:bg-primary/20 dark:text-grafico-claro`;

export function NavegacaoSecoes({ secoes }: { secoes: readonly SecaoAdministracao[] }) {
  return (
    <nav
      aria-label="Seções da administração"
      className="rounded-full bg-surface p-1.5 lg:sticky lg:top-8 lg:rounded-lg lg:p-2"
    >
      <ul className="scrollbar-hide flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {secoes.map(({ id, titulo, descricao, icone: Icone }) => (
          <li key={id} className="shrink-0">
            <NavLink
              to={`/administracao/${id}`}
              className={({ isActive }) => (isActive ? ITEM_ATIVO : ITEM_INATIVO)}
            >
              <Icone size={18} strokeWidth={2} aria-hidden="true" className="shrink-0" />
              <span className="flex min-w-0 flex-col">
                <span>{titulo}</span>
                <span className="hidden text-xs font-normal text-fg-muted lg:block">
                  {descricao}
                </span>
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
