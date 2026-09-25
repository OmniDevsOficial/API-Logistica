// Modal de filtros do dashboard de viagens.
// 4 critérios: destino, status, frete (min/max) e mês — todos batendo
// com os query params reais do endpoint GET /viagens.
import { useState, useEffect, useRef } from "react";
import { X, SlidersHorizontal, MapPin, Loader2, AlertCircle } from "lucide-react";
import { useFiltroViagens } from "../model/useFiltroViagens";

type FiltrarViagensModalProps = {
  onClose: () => void;
  onFiltroAplicado?: (resultado: any[]) => void;
  onFiltroLimpo?: () => void;
};

const STATUS_OPCOES = [
  { valor: "PENDENTE", label: "Pendente", cor: "bg-amber-400" },
  { valor: "EM_TRANSITO", label: "Em trânsito", cor: "bg-blue-400" },
  { valor: "FINALIZADO", label: "Finalizado", cor: "bg-emerald-400" },
] as const;

const INPUT_CLASS =
  "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-shadow";

export function FiltrarViagensModal({
  onClose,
  onFiltroAplicado,
  onFiltroLimpo,
}: FiltrarViagensModalProps) {
  const {
    filtro,
    setFiltro,
    carregando,
    erro,
    aplicar,
    limpar,
  } = useFiltroViagens(onFiltroAplicado);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleAplicar = async () => {
    await aplicar();
    onClose();
  };

  const handleLimpar = () => limpar(onFiltroLimpo);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
              <SlidersHorizontal className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Filtrar viagens
              </h2>
              <p className="text-sm text-slate-500">
                Refine a lista pelos critérios abaixo
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Corpo */}
        <div className="px-6 py-5 space-y-5 max-h-[65vh] overflow-y-auto">
          {/* Destino */}
          <div>
            <label
              htmlFor="destino"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Destino
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                ref={inputRef}
                id="destino"
                type="text"
                placeholder="Ex: São Paulo, Curitiba..."
                value={filtro.destino}
                onChange={(e) =>
                  setFiltro((f) => ({ ...f, destino: e.target.value }))
                }
                className={`${INPUT_CLASS} pl-9`}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Status
            </span>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPCOES.map((opcao) => {
                const ativo = filtro.status.includes(opcao.valor);
                return (
                  <button
                    key={opcao.valor}
                    type="button"
                    onClick={() => {
                      const novo = ativo
                        ? filtro.status.filter((s) => s !== opcao.valor)
                        : [...filtro.status, opcao.valor];
                      setFiltro((f) => ({ ...f, status: novo }));
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                      ativo
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-300 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${opcao.cor}`} />
                    {opcao.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Frete */}
          <div>
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Frete (R$)
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                inputMode="decimal"
                placeholder="Mín."
                value={filtro.freteMin == null ? "" : filtro.freteMin}
                onChange={(e) => {
                  const valor = e.target.value.replace(/[^\d.]/g, "");
                  setFiltro((f) => ({
                    ...f,
                    freteMin: valor ? Number(valor) : null,
                  }));
                }}
                className={INPUT_CLASS}
              />
              <span className="text-slate-400 text-sm shrink-0">até</span>
              <input
                type="text"
                inputMode="decimal"
                placeholder="Máx."
                value={filtro.freteMax == null ? "" : filtro.freteMax}
                onChange={(e) => {
                  const valor = e.target.value.replace(/[^\d.]/g, "");
                  setFiltro((f) => ({
                    ...f,
                    freteMax: valor ? Number(valor) : null,
                  }));
                }}
                className={INPUT_CLASS}
              />
            </div>
          </div>

          {/* Mês */}
          <div>
            <label
              htmlFor="mes"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Mês
            </label>
            <input
              id="mes"
              type="month"
              value={filtro.mes}
              onChange={(e) =>
                setFiltro((f) => ({ ...f, mes: e.target.value }))
              }
              className={INPUT_CLASS}
            />
          </div>

          {erro && (
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800">{erro}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <button
            onClick={handleLimpar}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            Limpar
          </button>
          <button
            onClick={handleAplicar}
            disabled={carregando}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-40 transition-colors"
          >
            {carregando && <Loader2 className="h-4 w-4 animate-spin" />}
            {carregando ? "Aplicando..." : "Aplicar filtro"}
          </button>
        </div>
      </div>
    </div>
  );
}