import { ChevronLeft, ChevronRight } from "lucide-react";
import { paginasVisiveis, RETICENCIAS } from "@shared/lib";

export interface PaginacaoProps {
  paginaAtual: number;
  totalPaginas: number;
  onMudarPagina: (pagina: number) => void;
}

const BOTAO =
  "flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-md px-2 text-sm font-medium tabular-nums transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40";

export function Paginacao({ paginaAtual, totalPaginas, onMudarPagina }: PaginacaoProps) {
  if (totalPaginas <= 1) return null;

  return (
    <nav aria-label="Paginação" className="flex flex-wrap items-center justify-center gap-1">
      <button
        type="button"
        className={`${BOTAO} text-fg-muted hover:bg-surface hover:text-fg`}
        onClick={() => onMudarPagina(paginaAtual - 1)}
        disabled={paginaAtual === 1}
        aria-label="Página anterior"
      >
        <ChevronLeft size={16} />
      </button>

      {paginasVisiveis(paginaAtual, totalPaginas).map((item, index) =>
        item === RETICENCIAS ? (
          <span key={`reticencias-${index}`} className="px-1 text-sm text-fg-subtle">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={`${BOTAO} ${
              item === paginaAtual
                ? "bg-primary text-white"
                : "text-fg hover:bg-surface"
            }`}
            onClick={() => onMudarPagina(item)}
            aria-current={item === paginaAtual ? "page" : undefined}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        className={`${BOTAO} text-fg-muted hover:bg-surface hover:text-fg`}
        onClick={() => onMudarPagina(paginaAtual + 1)}
        disabled={paginaAtual === totalPaginas}
        aria-label="Próxima página"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
