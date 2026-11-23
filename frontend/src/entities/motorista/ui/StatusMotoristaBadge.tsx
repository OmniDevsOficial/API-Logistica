import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import type { StatusEquipe } from "../model/types";

interface StatusMotoristaBadgeProps {
  status: StatusEquipe;
  /** Sem onChange o badge vira apenas visual (mesma aparência do protótipo). */
  onChange?: (novoStatus: StatusEquipe) => void;
  salvando?: boolean;
}

interface OpcaoStatus {
  label: string;
  valor: StatusEquipe;
  dot: string;
}

const STATUS_LABEL: Record<StatusEquipe, string> = {
  disponivel: "Disponível",
  em_viagem: "Em viagem",
  indisponivel: "Indisponível",
};

const STATUS_CLASS: Record<StatusEquipe, string> = {
  disponivel: "bg-success/15 text-success",
  em_viagem: "bg-primary/10 text-primary",
  indisponivel: "bg-red-500/15 text-red-500",
};

const OPCOES: OpcaoStatus[] = [
  { label: "Disponível", valor: "disponivel", dot: "bg-success" },
  { label: "Em viagem", valor: "em_viagem", dot: "bg-primary" },
  { label: "Indisponível", valor: "indisponivel", dot: "bg-red-500" },
];

interface PosicaoMenu {
  top: number;
  right: number;
}

export function StatusMotoristaBadge({
  status,
  onChange,
  salvando = false,
}: StatusMotoristaBadgeProps) {
  const [aberto, setAberto] = useState(false);
  const [posicao, setPosicao] = useState<PosicaoMenu | null>(null);
  const botaoRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;

    function foiFora(evento: MouseEvent) {
      const alvo = evento.target as Node;
      const dentroDoBotao = botaoRef.current?.contains(alvo);
      const dentroDoMenu = menuRef.current?.contains(alvo);
      if (!dentroDoBotao && !dentroDoMenu) setAberto(false);
    }

    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === "Escape") setAberto(false);
    }

    function aoRolar() {
      setAberto(false);
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

  function alternarMenu() {
    const retangulo = botaoRef.current?.getBoundingClientRect();
    if (retangulo) {
      setPosicao({
        top: retangulo.bottom + 6,
        right: Math.max(8, window.innerWidth - retangulo.right),
      });
    }
    setAberto((valor) => !valor);
  }

  function selecionar(novoStatus: StatusEquipe) {
    setAberto(false);
    if (novoStatus !== status) onChange?.(novoStatus);
  }

  const badge = (
    <>
      {STATUS_LABEL[status]}
      <ChevronDown
        size={14}
        strokeWidth={2.5}
        className={`transition-transform ${aberto ? "rotate-180" : ""}`}
      />
    </>
  );

  const classes = `inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_CLASS[status]}`;

  if (!onChange) {
    return <span className={classes}>{badge}</span>;
  }

  return (
    <>
      <button
        ref={botaoRef}
        type="button"
        onClick={alternarMenu}
        disabled={salvando}
        aria-haspopup="menu"
        aria-expanded={aberto}
        aria-label={`Status: ${STATUS_LABEL[status]}. Alterar status`}
        className={`${classes} cursor-pointer transition-opacity disabled:cursor-wait disabled:opacity-60`}
      >
        {badge}
      </button>

      {aberto &&
        posicao &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-label="Alterar status do motorista"
            style={{ top: posicao.top, right: posicao.right }}
            className="fixed z-50 w-44 overflow-hidden rounded-md border border-border bg-surface py-1 shadow-lg"
          >
            {OPCOES.map((opcao) => {
              const atual = opcao.valor === status;
              return (
                <button
                  key={opcao.valor}
                  type="button"
                  role="menuitem"
                  onClick={() => selecionar(opcao.valor)}
                  className="flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-background"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${opcao.dot}`}
                    />
                    <span className={atual ? "font-semibold text-fg" : "text-fg-muted"}>
                      {opcao.label}
                    </span>
                  </span>
                  {atual && <Check size={14} className="text-primary" />}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}
