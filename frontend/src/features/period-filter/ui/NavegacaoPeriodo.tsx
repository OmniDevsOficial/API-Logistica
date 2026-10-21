import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const DATE_RANGE_CLASS =
  "flex items-center gap-2 whitespace-nowrap rounded-md bg-surface px-4 py-2.5 text-sm font-medium text-black";
const NAV_BUTTON_CLASS =
  "flex cursor-pointer items-center text-fg-muted transition-colors duration-150 hover:text-fg disabled:cursor-not-allowed disabled:opacity-40";

interface NavegacaoPeriodoProps {
  label: string;
  podeAvancar: boolean;
  onAnterior: () => void;
  onSeguinte: () => void;
  className?: string;
}

export function NavegacaoPeriodo({
  label,
  podeAvancar,
  onAnterior,
  onSeguinte,
  className,
}: NavegacaoPeriodoProps) {
  return (
    <div className={`${DATE_RANGE_CLASS} ${className ?? ""}`}>
      <button
        type="button"
        className={NAV_BUTTON_CLASS}
        onClick={onAnterior}
        aria-label="Período anterior"
      >
        <ChevronLeft size={16} />
      </button>

      <Calendar size={16} />
      <span>{label}</span>

      <button
        type="button"
        className={NAV_BUTTON_CLASS}
        onClick={onSeguinte}
        disabled={!podeAvancar}
        aria-label="Período seguinte"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
