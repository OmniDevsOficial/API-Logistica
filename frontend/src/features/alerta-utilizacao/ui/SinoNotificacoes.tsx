import { useEffect, useRef, useState } from "react";
import { AlertCircle, Bell } from "lucide-react";
import { mensagemAlerta } from "../lib/mensagemAlerta";
import { useAlertasUtilizacao } from "../model/useAlertasUtilizacao";

const LIMITE_CONTADOR = 99;

export function SinoNotificacoes() {
  const alertas = useAlertasUtilizacao();
  const [aberto, setAberto] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;

    function foiFora(evento: MouseEvent) {
      if (!containerRef.current?.contains(evento.target as Node)) {
        setAberto(false);
      }
    }

    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === "Escape") setAberto(false);
    }

    function aoRolar(evento: Event) {
      if (!containerRef.current?.contains(evento.target as Node)) {
        setAberto(false);
      }
    }

    document.addEventListener("mousedown", foiFora);
    document.addEventListener("keydown", aoTeclar);
    document.addEventListener("scroll", aoRolar, true);
    return () => {
      document.removeEventListener("mousedown", foiFora);
      document.removeEventListener("keydown", aoTeclar);
      document.removeEventListener("scroll", aoRolar, true);
    };
  }, [aberto]);

  const total = alertas.length;
  const rotulo =
    total === 0
      ? "Notificações"
      : `Notificações: ${total} ${total === 1 ? "alerta" : "alertas"}`;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setAberto((valor) => !valor)}
        aria-label={rotulo}
        aria-haspopup="dialog"
        aria-expanded={aberto}
        className="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-surface text-black hover:text-fg"
      >
        <Bell size={18} />
        {total > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {total > LIMITE_CONTADOR ? `${LIMITE_CONTADOR}+` : total}
          </span>
        )}
      </button>

      {aberto && (
        <div
          role="dialog"
          aria-label="Notificações"
          className="fixed inset-x-4 top-20 z-50 overflow-hidden rounded-md border border-border bg-surface shadow-lg sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:mt-2 sm:w-80"
        >
          <p className="border-b border-border px-4 py-3 text-sm font-semibold text-fg">
            Notificações
          </p>

          {total === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-fg-subtle">
              Nenhuma notificação.
            </p>
          ) : (
            <ul className="max-h-80 divide-y divide-border overflow-y-auto">
              {alertas.map((alerta) => (
                <li
                  key={alerta.id}
                  className="flex items-start gap-2 px-4 py-3 text-sm text-fg"
                >
                  <AlertCircle
                    size={16}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-red-500"
                  />
                  <span>{mensagemAlerta(alerta)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
