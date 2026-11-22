import { useEffect, useRef, useState } from "react";
import { AlertCircle, Bell, FileSpreadsheet, UserPlus, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatarQuando } from "../lib/montarNotificacoes";
import type { Notificacao, TipoNotificacao, TomNotificacao } from "../model/types";
import { useNotificacoes } from "../model/useNotificacoes";

const LIMITE_CONTADOR = 99;
const DURACAO_SAIDA_MS = 250;
const ATRASO_CASCATA_MS = 40;
const MAX_ITENS_CASCATA = 8;

function movimentoReduzido(): boolean {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const ICONE: Record<TipoNotificacao, LucideIcon> = {
  utilizacao: AlertCircle,
  importacao: FileSpreadsheet,
  usuario: UserPlus,
};

const COR_ICONE: Record<TomNotificacao, string> = {
  alerta: "text-red-500",
  erro: "text-red-500",
  aviso: "text-amber-500",
  sucesso: "text-green-500",
  info: "text-primary",
};

interface ItemNotificacaoProps {
  notificacao: Notificacao;
  agora: Date;
  atrasoSaida: number | undefined;
  onExcluir: () => void;
}

function ItemNotificacao({ notificacao, agora, atrasoSaida, onExcluir }: ItemNotificacaoProps) {
  const Icone = ICONE[notificacao.tipo];
  const saindo = atrasoSaida !== undefined;

  return (
    <li
      aria-hidden={saindo || undefined}
      style={saindo ? { transitionDelay: `${atrasoSaida}ms` } : undefined}
      className={`grid transition-[grid-template-rows,opacity,translate] duration-250 ease-out motion-reduce:transition-none ${
        saindo ? "translate-x-8 grid-rows-[0fr] border-transparent opacity-0" : "grid-rows-[1fr]"
      }`}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="flex items-start gap-2 py-3 pr-2 pl-4 text-sm text-fg">
          <Icone
            size={16}
            aria-hidden="true"
            className={`mt-0.5 shrink-0 ${COR_ICONE[notificacao.tom]}`}
          />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span>{notificacao.titulo}</span>
            {notificacao.detalhe && (
              <span className="break-words text-xs text-fg-muted">{notificacao.detalhe}</span>
            )}
            {notificacao.data && (
              <time
                dateTime={notificacao.data.toISOString()}
                className="text-xs text-fg-subtle"
              >
                {formatarQuando(notificacao.data, agora)}
              </time>
            )}
          </div>
          <button
            type="button"
            onClick={onExcluir}
            disabled={saindo}
            aria-label={`Excluir notificação: ${notificacao.titulo}`}
            title="Excluir notificação"
            className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded text-fg-subtle transition-colors hover:bg-background hover:text-fg"
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </li>
  );
}

interface SinoNotificacoesProps {
  dataInicio?: string;
  dataFim?: string;
}

export function SinoNotificacoes({ dataInicio, dataFim }: SinoNotificacoesProps) {
  const { notificacoes, dispensar } = useNotificacoes(dataInicio, dataFim);
  const [aberto, setAberto] = useState(false);
  const [saindo, setSaindo] = useState<Map<string, number>>(() => new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const temporizadoresRef = useRef(new Map<string, number>());
  const dispensarRef = useRef(dispensar);

  useEffect(() => {
    dispensarRef.current = dispensar;
  }, [dispensar]);

  useEffect(() => {
    const pendentes = temporizadoresRef.current;
    return () => {
      const chaves = [...pendentes.keys()];
      new Set(pendentes.values()).forEach((id) => window.clearTimeout(id));
      pendentes.clear();
      if (chaves.length > 0) dispensarRef.current(chaves);
    };
  }, []);

  function excluir(chaves: string[]) {
    const pendentes = temporizadoresRef.current;
    const novas = chaves.filter((chave) => !pendentes.has(chave));
    if (novas.length === 0) return;

    if (movimentoReduzido()) {
      dispensar(novas);
      return;
    }

    const atrasos = new Map(
      novas.map((chave, indice) => [
        chave,
        Math.min(indice, MAX_ITENS_CASCATA) * ATRASO_CASCATA_MS,
      ]),
    );
    setSaindo((atual) => new Map([...atual, ...atrasos]));

    const espera = DURACAO_SAIDA_MS + Math.max(...atrasos.values());
    const id = window.setTimeout(() => {
      novas.forEach((chave) => pendentes.delete(chave));
      dispensarRef.current(novas);
      setSaindo((atual) => {
        const proximo = new Map(atual);
        novas.forEach((chave) => proximo.delete(chave));
        return proximo;
      });
    }, espera);
    novas.forEach((chave) => pendentes.set(chave, id));
  }

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

  const total = notificacoes.filter((notificacao) => !saindo.has(notificacao.chave)).length;
  const rotulo =
    total === 0
      ? "Notificações"
      : `Notificações: ${total} ${total === 1 ? "notificação" : "notificações"}`;
  const agora = new Date();

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setAberto((valor) => !valor)}
        aria-label={rotulo}
        aria-haspopup="dialog"
        aria-expanded={aberto}
        className="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-surface text-fg hover:text-fg-muted"
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
          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-fg">Notificações</p>
            {total > 0 && (
              <button
                type="button"
                onClick={() => excluir(notificacoes.map((notificacao) => notificacao.chave))}
                className="cursor-pointer text-xs font-medium text-primary hover:underline"
              >
                Limpar todas
              </button>
            )}
          </div>

          {notificacoes.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-fg-subtle">
              Nenhuma notificação.
            </p>
          ) : (
            <ul className="max-h-80 divide-y divide-border overflow-y-auto">
              {notificacoes.map((notificacao) => (
                <ItemNotificacao
                  key={notificacao.chave}
                  notificacao={notificacao}
                  agora={agora}
                  atrasoSaida={saindo.get(notificacao.chave)}
                  onExcluir={() => excluir([notificacao.chave])}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
