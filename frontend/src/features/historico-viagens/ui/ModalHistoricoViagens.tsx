import { useEffect, useId, useRef } from "react";
import type { MouseEvent, SyntheticEvent } from "react";
import { X } from "lucide-react";
import { ViagemHistoricoCard } from "@entities/viagem";
import { useHistoricoViagens } from "../model/useHistoricoViagens";

interface ModalHistoricoViagensProps {
  motoristaId: number | null;
  nome: string;
  open: boolean;
  onClose: () => void;
}

const FOCO_PRIMARIO =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const ESTADO_CLASS = "py-10 text-center text-sm text-fg-subtle";

function rotuloTotal(total: number): string {
  return total === 1 ? "1 viagem" : `${total} viagens`;
}

export function ModalHistoricoViagens({
  motoristaId,
  nome,
  open,
  onClose,
}: ModalHistoricoViagensProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const botaoFecharRef = useRef<HTMLButtonElement>(null);
  const tituloId = useId();
  const {
    viagens,
    totalViagens,
    ultimaPagina,
    carregando,
    erro,
    carregandoMais,
    erroMais,
    carregarMais,
    tentarDeNovo,
  } = useHistoricoViagens(motoristaId, open);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;

    const origemDoFoco =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    if (!dialog.open) dialog.showModal();
    botaoFecharRef.current?.focus();

    return () => {
      if (dialog.open) dialog.close();
      if (origemDoFoco?.isConnected) origemDoFoco.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflowAnterior;
    };
  }, [open]);

  function aoCancelar(evento: SyntheticEvent<HTMLDialogElement>) {
    evento.preventDefault();
    onClose();
  }

  function aoFecharNativo() {
    if (open) onClose();
  }

  function aoPressionarFundo(evento: MouseEvent<HTMLDialogElement>) {
    if (evento.target === evento.currentTarget) onClose();
  }

  const subtitulo =
    carregando || erro !== null ? nome : `${nome} · ${rotuloTotal(totalViagens)}`;

  let conteudo;
  if (carregando) {
    conteudo = (
      <p role="status" className={ESTADO_CLASS}>
        Carregando viagens...
      </p>
    );
  } else if (erro !== null) {
    conteudo = (
      <div role="alert" className={ESTADO_CLASS}>
        <p className="m-0">{erro}</p>
        <button
          type="button"
          onClick={tentarDeNovo}
          className={`mt-3 cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark ${FOCO_PRIMARIO}`}
        >
          Tentar de novo
        </button>
      </div>
    );
  } else if (viagens.length === 0) {
    conteudo = (
      <p role="status" className={ESTADO_CLASS}>
        Nenhuma viagem registrada
      </p>
    );
  } else {
    conteudo = (
      <ul
        aria-label={`Viagens de ${nome}`}
        aria-busy={carregandoMais}
        className="m-0 flex list-none flex-col gap-3 p-0"
      >
        {viagens.map((viagem) => (
          <li key={viagem.id}>
            <ViagemHistoricoCard viagem={viagem} />
          </li>
        ))}
      </ul>
    );
  }

  const exibirRodape = !carregando && erro === null && viagens.length > 0;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={tituloId}
      onCancel={aoCancelar}
      onClose={aoFecharNativo}
      onMouseDown={aoPressionarFundo}
      className="m-auto max-h-[88vh] w-[92vw] max-w-[640px] overflow-hidden rounded-2xl bg-surface p-0 text-left text-fg shadow-2xl backdrop:bg-black/50"
    >
      <div className="flex max-h-[88vh] flex-col">
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-7 sm:py-5">
          <div className="min-w-0">
            <h2 id={tituloId} className="m-0 text-xl font-bold text-fg">
              Histórico de viagens
            </h2>
            <p className="m-0 mt-1 truncate text-sm text-fg-muted">{subtitulo}</p>
          </div>

          <button
            ref={botaoFecharRef}
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className={`flex shrink-0 cursor-pointer rounded-full border-0 bg-transparent p-1.5 text-fg-muted transition-colors hover:bg-background hover:text-fg ${FOCO_PRIMARIO}`}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-7">
          {conteudo}
        </div>

        {exibirRodape && (
          <footer className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div className="flex min-w-0 flex-col gap-1">
              <p aria-live="polite" className="m-0 text-sm text-fg-muted">
                {`Mostrando ${viagens.length} de ${totalViagens}`}
              </p>
              {erroMais !== null && (
                <p role="alert" className="m-0 text-sm text-red-500">
                  {erroMais}
                </p>
              )}
            </div>

            {!ultimaPagina && (
              <button
                type="button"
                onClick={carregarMais}
                disabled={carregandoMais}
                className={`inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-transparent px-5 py-2 text-sm font-semibold text-fg transition-colors hover:bg-background disabled:cursor-wait disabled:opacity-60 ${FOCO_PRIMARIO}`}
              >
                {carregandoMais
                  ? "Carregando..."
                  : erroMais !== null
                    ? "Tentar de novo"
                    : "Carregar mais"}
              </button>
            )}
          </footer>
        )}
      </div>
    </dialog>
  );
}
