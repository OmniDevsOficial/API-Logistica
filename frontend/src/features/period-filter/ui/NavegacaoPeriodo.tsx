import { useEffect, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import type { PeriodOption } from "@entities/dashboard-metrics";
import { SeletorPeriodo } from "./SeletorPeriodo";

const DATE_RANGE_CLASS =
  "relative flex items-center gap-2 whitespace-nowrap rounded-md bg-surface px-4 py-2.5 text-sm font-medium text-black";
const NAV_BUTTON_CLASS =
  "flex shrink-0 cursor-pointer items-center text-fg-muted transition-colors duration-150 hover:text-fg disabled:cursor-not-allowed disabled:opacity-40";
// Largura fixa para as setas não mudarem de lugar quando o texto muda de tamanho.
const LABEL_CLASS =
  "flex min-w-0 flex-1 items-center justify-center gap-2 sm:w-[18rem] sm:flex-none";

interface NavegacaoPeriodoProps {
  label: string;
  podeAvancar: boolean;
  onAnterior: () => void;
  onSeguinte: () => void;
  className?: string;
  /** Quando informado com `periodo` e `referencia`, a data abre um calendário. */
  onSelecionarData?: (data: Date) => void;
  periodo?: PeriodOption;
  referencia?: Date;
}

export function NavegacaoPeriodo({
  label,
  podeAvancar,
  onAnterior,
  onSeguinte,
  className,
  onSelecionarData,
  periodo,
  referencia,
}: NavegacaoPeriodoProps) {
  const [aberto, setAberto] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const calendario =
    onSelecionarData && periodo && referencia
      ? { onSelecionarData, periodo, referencia }
      : null;
  const comCalendario = calendario !== null;

  useEffect(() => {
    if (!aberto) return;

    function fecharAoClicarFora(evento: MouseEvent) {
      if (!containerRef.current?.contains(evento.target as Node)) setAberto(false);
    }
    function fecharComEsc(evento: KeyboardEvent) {
      if (evento.key === "Escape") setAberto(false);
    }

    document.addEventListener("mousedown", fecharAoClicarFora);
    document.addEventListener("keydown", fecharComEsc);
    return () => {
      document.removeEventListener("mousedown", fecharAoClicarFora);
      document.removeEventListener("keydown", fecharComEsc);
    };
  }, [aberto]);

  const conteudoLabel = (
    <>
      <Calendar size={16} className="shrink-0" />
      <span className="truncate tabular-nums">{label}</span>
    </>
  );

  return (
    <div ref={containerRef} className={`${DATE_RANGE_CLASS} ${className ?? ""}`}>
      <button
        type="button"
        className={NAV_BUTTON_CLASS}
        onClick={onAnterior}
        aria-label="Período anterior"
      >
        <ChevronLeft size={16} />
      </button>

      {comCalendario ? (
        <button
          type="button"
          className={`${LABEL_CLASS} cursor-pointer rounded transition-colors hover:text-primary`}
          onClick={() => setAberto((valor) => !valor)}
          aria-haspopup="dialog"
          aria-expanded={aberto}
          title="Escolher data"
        >
          {conteudoLabel}
        </button>
      ) : (
        <span className={LABEL_CLASS}>{conteudoLabel}</span>
      )}

      <button
        type="button"
        className={NAV_BUTTON_CLASS}
        onClick={onSeguinte}
        disabled={!podeAvancar}
        aria-label="Período seguinte"
      >
        <ChevronRight size={16} />
      </button>

      {aberto && calendario && (
        <div
          role="dialog"
          aria-label="Escolher data"
          className="absolute right-0 top-full z-30 mt-2 w-72 rounded-md border border-border bg-surface p-3 font-normal shadow-lg motion-safe:animate-surgir"
        >
          <SeletorPeriodo
            periodo={calendario.periodo}
            referencia={calendario.referencia}
            onSelecionar={(data) => {
              calendario.onSelecionarData(data);
              setAberto(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
