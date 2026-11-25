import { useEffect, useRef, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { formatTipoVeiculo } from "@shared/lib";
import type { FiltroRanking } from "@entities/motorista";

interface FiltroRankingProps {
  filtro: FiltroRanking;
  tipoVeiculo: string | null;
  tiposDisponiveis: string[];
  onChange: (filtro: FiltroRanking, tipoVeiculo: string | null) => void;
  buttonClassName?: string;
}

const OPCOES: { valor: FiltroRanking; rotulo: string }[] = [
  { valor: "RENTABILIDADE", rotulo: "Rentabilidade" },
  { valor: "FATURAMENTO", rotulo: "Receita de frete" },
  { valor: "VIAGENS", rotulo: "Número de viagens" },
  { valor: "TIPO_VEICULO", rotulo: "Tipo de veículo" },
];

const CHIP_CLASS =
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40";
const CHIP_ATIVO_CLASS = "border-primary bg-primary/10 text-primary";
const CHIP_INATIVO_CLASS =
  "border-slate-300 text-fg-muted hover:bg-background dark:border-border";

export function FiltroRanking({
  filtro,
  tipoVeiculo,
  tiposDisponiveis,
  onChange,
  buttonClassName,
}: FiltroRankingProps) {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setAberto(true)}
        className={
          buttonClassName ??
          "inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-slate-300 bg-surface px-4 py-2 text-sm font-medium text-fg shadow-sm hover:bg-background hover:border-slate-400 transition-colors dark:border-border"
        }
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filtrar
      </button>

      {aberto && (
        <FiltroRankingModal
          filtro={filtro}
          tipoVeiculo={tipoVeiculo}
          tiposDisponiveis={tiposDisponiveis}
          onChange={onChange}
          onClose={() => setAberto(false)}
        />
      )}
    </>
  );
}

interface FiltroRankingModalProps {
  filtro: FiltroRanking;
  tipoVeiculo: string | null;
  tiposDisponiveis: string[];
  onChange: (filtro: FiltroRanking, tipoVeiculo: string | null) => void;
  onClose: () => void;
}

function FiltroRankingModal({
  filtro,
  tipoVeiculo,
  tiposDisponiveis,
  onChange,
  onClose,
}: FiltroRankingModalProps) {
  const [criterio, setCriterio] = useState<FiltroRanking>(filtro);
  const [tipo, setTipo] = useState<string | null>(tipoVeiculo);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dialogRef.current?.querySelector<HTMLElement>("button:not([disabled])")?.focus();
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const selecionarCriterio = (valor: FiltroRanking) => {
    setCriterio(valor);
    setTipo(valor === "TIPO_VEICULO" ? tipo ?? tiposDisponiveis[0] ?? null : null);
  };

  const faltaTipo = criterio === "TIPO_VEICULO" && !tipo;

  const handleAplicar = () => {
    onChange(criterio, criterio === "TIPO_VEICULO" ? tipo : null);
    onClose();
  };

  const handleLimpar = () => {
    setCriterio("RENTABILIDADE");
    setTipo(null);
    onChange("RENTABILIDADE", null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-filtro-ranking"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-surface shadow-2xl ring-1 ring-border overflow-hidden"
      >
        <div className="flex items-start justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 id="titulo-filtro-ranking" className="text-base font-semibold text-fg">
                Filtrar ranking
              </h2>
              <p className="text-sm text-fg-muted">
                Refine o ranking pelos critérios abaixo
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-full p-1.5 text-fg-subtle hover:bg-background hover:text-fg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5 max-h-[65vh] overflow-y-auto">
          <div>
            <span className="mb-2 block text-sm font-medium text-fg">
              Ordenar por
            </span>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Ordenar por">
              {OPCOES.map((opcao) => {
                const ativo = criterio === opcao.valor;
                const semTipos = opcao.valor === "TIPO_VEICULO" && tiposDisponiveis.length === 0;
                return (
                  <button
                    key={opcao.valor}
                    type="button"
                    role="radio"
                    aria-checked={ativo}
                    disabled={semTipos}
                    onClick={() => selecionarCriterio(opcao.valor)}
                    className={`${CHIP_CLASS} ${ativo ? CHIP_ATIVO_CLASS : CHIP_INATIVO_CLASS}`}
                  >
                    {opcao.rotulo}
                  </button>
                );
              })}
            </div>
          </div>

          {criterio === "TIPO_VEICULO" && (
            <div>
              <span className="mb-2 block text-sm font-medium text-fg">
                Tipo de veículo
              </span>
              {tiposDisponiveis.length === 0 ? (
                <p className="text-sm text-fg-muted">Nenhum tipo disponível neste período.</p>
              ) : (
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Tipo de veículo">
                  {tiposDisponiveis.map((opcao) => {
                    const ativo = tipo === opcao;
                    return (
                      <button
                        key={opcao}
                        type="button"
                        role="radio"
                        aria-checked={ativo}
                        onClick={() => setTipo(opcao)}
                        className={`${CHIP_CLASS} ${ativo ? CHIP_ATIVO_CLASS : CHIP_INATIVO_CLASS}`}
                      >
                        {formatTipoVeiculo(opcao) ?? opcao}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between gap-2 border-t border-border bg-background px-6 py-4">
          <button
            type="button"
            onClick={handleLimpar}
            className="rounded-lg px-4 py-2 text-sm font-medium text-fg-muted hover:bg-border hover:text-fg transition-colors"
          >
            Limpar
          </button>
          <button
            type="button"
            onClick={handleAplicar}
            disabled={faltaTipo}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark disabled:opacity-40 transition-colors"
          >
            Aplicar filtro
          </button>
        </div>
      </div>
    </div>
  );
}
