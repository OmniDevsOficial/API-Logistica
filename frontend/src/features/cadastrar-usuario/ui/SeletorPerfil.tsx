import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { Perfil } from "@entities/sessao";

interface OpcaoPerfil {
  valor: Perfil;
  rotulo: string;
  descricao: string;
  ponto: string;
}

const OPCOES: readonly OpcaoPerfil[] = [
  {
    valor: "OPERADOR",
    rotulo: "Operador",
    descricao: "Acessa viagens e motoristas",
    ponto: "bg-success",
  },
  {
    valor: "GESTOR",
    rotulo: "Gestor",
    descricao: "Acesso completo, incluindo configurações",
    ponto: "bg-primary dark:bg-grafico-claro",
  },
];

interface SeletorPerfilProps {
  id: string;
  valor: Perfil | "";
  onChange: (perfil: Perfil) => void;
  desabilitado: boolean;
  className: string;
  "aria-invalid": true | undefined;
  "aria-describedby": string | undefined;
}

export function SeletorPerfil({
  id,
  valor,
  onChange,
  desabilitado,
  className,
  ...acessibilidade
}: SeletorPerfilProps) {
  const [aberto, setAberto] = useState(false);
  const [destaque, setDestaque] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const botaoRef = useRef<HTMLButtonElement>(null);
  const listaRef = useRef<HTMLUListElement>(null);

  const idLista = `${id}-opcoes`;
  const selecionada = OPCOES.find((opcao) => opcao.valor === valor) ?? null;

  useEffect(() => {
    if (!aberto) return;
    listaRef.current?.focus();

    function aoClicarFora(evento: MouseEvent) {
      if (!containerRef.current?.contains(evento.target as Node)) setAberto(false);
    }
    document.addEventListener("mousedown", aoClicarFora);
    return () => document.removeEventListener("mousedown", aoClicarFora);
  }, [aberto]);

  function abrir() {
    if (desabilitado) return;
    const indiceAtual = OPCOES.findIndex((opcao) => opcao.valor === valor);
    setDestaque(indiceAtual >= 0 ? indiceAtual : 0);
    setAberto(true);
  }

  function fechar() {
    setAberto(false);
    botaoRef.current?.focus();
  }

  function escolher(opcao: OpcaoPerfil) {
    onChange(opcao.valor);
    fechar();
  }

  function aoTeclarNoBotao(evento: KeyboardEvent<HTMLButtonElement>) {
    if (evento.key === "ArrowDown" || evento.key === "ArrowUp") {
      evento.preventDefault();
      abrir();
    }
  }

  function aoTeclarNaLista(evento: KeyboardEvent<HTMLUListElement>) {
    switch (evento.key) {
      case "ArrowDown":
        evento.preventDefault();
        setDestaque((atual) => (atual + 1) % OPCOES.length);
        break;
      case "ArrowUp":
        evento.preventDefault();
        setDestaque((atual) => (atual - 1 + OPCOES.length) % OPCOES.length);
        break;
      case "Home":
        evento.preventDefault();
        setDestaque(0);
        break;
      case "End":
        evento.preventDefault();
        setDestaque(OPCOES.length - 1);
        break;
      case "Enter":
      case " ":
        evento.preventDefault();
        escolher(OPCOES[destaque]);
        break;
      case "Escape":
        evento.preventDefault();
        evento.stopPropagation();
        fechar();
        break;
      case "Tab":
        setAberto(false);
        break;
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        {...acessibilidade}
        ref={botaoRef}
        id={id}
        type="button"
        disabled={desabilitado}
        onClick={() => (aberto ? fechar() : abrir())}
        onKeyDown={aoTeclarNoBotao}
        aria-haspopup="listbox"
        aria-expanded={aberto}
        aria-controls={aberto ? idLista : undefined}
        className={`${className} flex cursor-pointer items-center justify-between gap-3 text-left ${
          aberto ? "border-primary ring-2 ring-primary/20" : ""
        }`}
      >
        {selecionada ? (
          <span className="flex min-w-0 items-center gap-2.5">
            <span className={`h-2 w-2 shrink-0 rounded-full ${selecionada.ponto}`} aria-hidden="true" />
            <span className="truncate text-fg">{selecionada.rotulo}</span>
          </span>
        ) : (
          <span className="truncate text-fg-subtle">Selecione o perfil</span>
        )}
        <ChevronDown
          size={17}
          aria-hidden="true"
          className={`shrink-0 text-fg-subtle transition-transform duration-150 ${aberto ? "rotate-180" : ""}`}
        />
      </button>

      {aberto && (
        <ul
          ref={listaRef}
          id={idLista}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={id}
          aria-activedescendant={`${idLista}-${OPCOES[destaque].valor}`}
          onKeyDown={aoTeclarNaLista}
          className="absolute top-full right-0 left-0 z-10 mt-1.5 flex animate-surgir flex-col gap-0.5 rounded-xl bg-surface p-1.5 shadow-[0_12px_32px_var(--color-shadow)] ring-1 ring-border outline-none"
        >
          {OPCOES.map((opcao, indice) => {
            const ativa = opcao.valor === valor;
            const destacada = indice === destaque;

            return (
              <li
                key={opcao.valor}
                id={`${idLista}-${opcao.valor}`}
                role="option"
                aria-selected={ativa}
                onMouseEnter={() => setDestaque(indice)}
                onMouseDown={(evento) => evento.preventDefault()}
                onClick={() => escolher(opcao)}
                className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                  destacada ? "bg-background" : ""
                }`}
              >
                <span className={`h-2 w-2 shrink-0 rounded-full ${opcao.ponto}`} aria-hidden="true" />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className={`text-sm ${ativa ? "font-semibold text-fg" : "font-medium text-fg"}`}>
                    {opcao.rotulo}
                  </span>
                  <span className="text-xs text-fg-muted">{opcao.descricao}</span>
                </span>
                {ativa && (
                  <Check size={16} className="shrink-0 text-primary dark:text-grafico-claro" aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
