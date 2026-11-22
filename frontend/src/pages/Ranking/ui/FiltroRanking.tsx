import { useEffect, useRef, useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { formatTipoVeiculo } from "@shared/lib";
import type { FiltroRanking } from "@entities/motorista";

interface FiltroRankingProps {
  filtro: FiltroRanking;
  tipoVeiculo: string | null;
  tiposDisponiveis: string[];
  onChange: (filtro: FiltroRanking, tipoVeiculo: string | null) => void;
}

const OPCOES: { valor: FiltroRanking; rotulo: string }[] = [
  { valor: "RENTABILIDADE", rotulo: "Rentabilidade" },
  { valor: "FATURAMENTO", rotulo: "Receita de frete" },
  { valor: "VIAGENS", rotulo: "Número de viagens" },
  { valor: "TIPO_VEICULO", rotulo: "Tipo de veículo" },
];

function rotuloFiltro(filtro: FiltroRanking, tipoVeiculo: string | null): string {
  if (filtro === "TIPO_VEICULO") {
    const tipo = formatTipoVeiculo(tipoVeiculo) ?? "Tipo de veículo";
    return `Tipo: ${tipo}`;
  }
  return OPCOES.find((opcao) => opcao.valor === filtro)?.rotulo ?? "Rentabilidade";
}

export function FiltroRanking({ filtro, tipoVeiculo, tiposDisponiveis, onChange }: FiltroRankingProps) {
  const [aberto, setAberto] = useState(false);
  const botaoRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    const dialogo = dialogRef.current;
    const botaoDeRetorno = botaoRef.current;
    const focaveis = () => Array.from(dialogo?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ) ?? []);
    focaveis()[0]?.focus();
    const controlarTeclado = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        setAberto(false);
        return;
      }
      if (evento.key !== "Tab") return;
      const elementos = focaveis();
      const primeiro = elementos[0];
      const ultimo = elementos.at(-1);
      if (!primeiro || !ultimo) return;
      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primeiro.focus();
      }
    };
    window.addEventListener("keydown", controlarTeclado);
    return () => {
      window.removeEventListener("keydown", controlarTeclado);
      botaoDeRetorno?.focus();
    };
  }, [aberto]);

  return (
    <div className="relative shrink-0">
      <button
        ref={botaoRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={aberto}
        onClick={() => setAberto((atual) => !atual)}
        className="inline-flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-fg shadow-sm transition-colors hover:bg-background sm:w-auto"
      >
        <SlidersHorizontal aria-hidden="true" className="h-4 w-4 text-fg-muted" />
        <span>Filtrar: {rotuloFiltro(filtro, tipoVeiculo)}</span>
        <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform ${aberto ? "rotate-180" : ""}`} />
      </button>

      {aberto && (
        <>
          <button
            type="button"
            aria-label="Fechar filtros"
            tabIndex={-1}
            onClick={() => setAberto(false)}
            className="fixed inset-0 z-40 cursor-default bg-slate-950/40 sm:bg-transparent"
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Filtrar ranking"
            className="fixed inset-x-3 bottom-3 z-50 max-h-[80vh] overflow-y-auto rounded-2xl border border-border bg-surface p-4 shadow-2xl sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80 sm:max-h-[min(70vh,30rem)]"
          >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-fg">Filtrar ranking</h2>
            <button
              type="button"
              aria-label="Fechar filtros"
              onClick={() => setAberto(false)}
              className="rounded-md p-1 text-fg-muted hover:bg-background hover:text-fg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <fieldset className="space-y-1">
            <legend className="sr-only">Critério de ordenação</legend>
            {OPCOES.map((opcao) => {
              const selecionado = filtro === opcao.valor;
              const semTipos = opcao.valor === "TIPO_VEICULO" && tiposDisponiveis.length === 0;
              return (
                <div key={opcao.valor}>
                  <label className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${selecionado ? "bg-primary/10 text-primary" : "text-fg hover:bg-background"} ${semTipos ? "cursor-not-allowed opacity-50" : ""}`}>
                    <input
                      type="radio"
                      name="filtro-ranking"
                      value={opcao.valor}
                      checked={selecionado}
                      disabled={semTipos}
                      onChange={() => {
                        if (opcao.valor === "TIPO_VEICULO") {
                          onChange(opcao.valor, tiposDisponiveis[0] ?? null);
                        } else {
                          onChange(opcao.valor, null);
                        }
                      }}
                      className="h-4 w-4 accent-primary"
                    />
                    <span>{opcao.rotulo}</span>
                  </label>

                  {selecionado && opcao.valor === "TIPO_VEICULO" && (
                    <div className="ml-10 mt-1 space-y-1 border-l border-border pl-3">
                      {tiposDisponiveis.length === 0 ? (
                        <p className="py-2 text-xs text-fg-muted">Nenhum tipo disponível neste mês.</p>
                      ) : tiposDisponiveis.map((tipo) => (
                        <label key={tipo} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-fg hover:bg-background">
                          <input
                            type="radio"
                            name="tipo-veiculo-ranking"
                            value={tipo}
                            checked={tipoVeiculo === tipo}
                            onChange={() => onChange("TIPO_VEICULO", tipo)}
                            className="h-4 w-4 accent-primary"
                          />
                          <span>{formatTipoVeiculo(tipo) ?? tipo}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </fieldset>

          <div className="mt-4 border-t border-border pt-3">
            <button
              type="button"
              onClick={() => {
                onChange("RENTABILIDADE", null);
                setAberto(false);
              }}
              className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-fg-muted transition-colors hover:bg-background hover:text-fg"
            >
              Limpar filtro
            </button>
          </div>
          </div>
        </>
      )}
    </div>
  );
}
