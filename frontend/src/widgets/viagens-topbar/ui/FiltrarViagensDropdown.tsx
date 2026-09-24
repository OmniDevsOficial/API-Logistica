// Dropdown de filtros do dashboard de viagens.
// Painel com 3 grupos de critério: disponibilidade, ordenação por valor
// e numéricos (km / dias).
import { useState, useRef, useEffect } from "react";
import {
  SlidersHorizontal,
  ChevronDown,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useFiltroViagens } from "../model/useFiltroViagens";

type FiltrarViagensDropdownProps = {
  onFiltroAplicado?: (resultado: any[]) => void;
  onFiltroLimpo?: () => void;
  buttonClassName?: string;
};

export function FiltrarViagensDropdown({
  onFiltroAplicado,
  onFiltroLimpo,
  buttonClassName,
}: FiltrarViagensDropdownProps) {
  const [aberto, setAberto] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    filtro,
    setFiltro,
    carregando,
    erro,
    quantidadeAtiva,
    aplicar,
    limpar,
  } = useFiltroViagens(onFiltroAplicado);

  // Detecta clique fora do painel pra fechar
  useEffect(() => {
    const handleClickFora = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setAberto(false);
      }
    };
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  const handleAplicar = async () => {
    await aplicar();
    setAberto(false);
  };

  const handleLimpar = () => limpar(onFiltroLimpo);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        onClick={() => setAberto((prev) => !prev)}
        className={
          buttonClassName ??
          "inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-400 transition-colors"
        }
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filtrar
        {quantidadeAtiva > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-xs font-semibold text-white">
            {quantidadeAtiva}
          </span>
        )}
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform ${aberto ? "rotate-180" : ""}`}
        />
      </button>

      {aberto && (
        <div className="absolute right-0 z-40 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="px-5 py-4 space-y-5 max-h-[70vh] overflow-y-auto">
            {/* Disponibilidade */}
            <div>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filtro.apenasDisponiveis}
                  onChange={(e) =>
                    setFiltro((f) => ({
                      ...f,
                      apenasDisponiveis: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-blue-500/30"
                />
                <span className="text-sm font-medium text-slate-700">
                  Apenas rotas disponíveis
                </span>
              </label>
            </div>

            <hr className="border-slate-100" />

            {/* Ordenação por valor — clicar de novo na opção já marcada desmarca */}
            <div>
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Ordenar por valor
              </span>
              <div className="flex gap-2">
                {[
                  { valor: "valor-maior", label: "Maior valor" },
                  { valor: "valor-menor", label: "Menor valor" },
                ].map((opcao) => (
                  <button
                    key={opcao.valor}
                    onClick={() =>
                      setFiltro((f) => ({
                        ...f,
                        ordenarPor:
                          f.ordenarPor === opcao.valor
                            ? null
                            : (opcao.valor as any),
                      }))
                    }
                    className={`flex-1 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                      filtro.ordenarPor === opcao.valor
                        ? "border-primary bg-blue-50 text-blue-700"
                        : "border-slate-300 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {opcao.label}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Quilometragem */}
            <div>
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Quilometragem
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Mín."
                  value={filtro.kmMin == null ? "" : Number(filtro.kmMin)}
                  onChange={(e) =>
                    setFiltro((f) => ({
                      ...f,
                      kmMin: e.target.value ? Number(e.target.value) : null,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <span className="text-slate-400 text-sm">até</span>
                <input
                  type="number"
                  placeholder="Máx."
                  value={filtro.kmMax == null ? "" : Number(filtro.kmMax)}
                  onChange={(e) =>
                    setFiltro((f) => ({
                      ...f,
                      kmMax: e.target.value ? Number(e.target.value) : null,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Estimativa de dias */}
            <div>
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Estimativa de dias
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Mín."
                  value={filtro.diasMin == null ? "" : Number(filtro.diasMin)}
                  onChange={(e) =>
                    setFiltro((f) => ({
                      ...f,
                      diasMin: e.target.value ? Number(e.target.value) : null,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <span className="text-slate-400 text-sm">até</span>
                <input
                  type="number"
                  placeholder="Máx."
                  value={filtro.diasMax == null ? "" : Number(filtro.diasMax)}
                  onChange={(e) =>
                    setFiltro((f) => ({
                      ...f,
                      diasMax: e.target.value ? Number(e.target.value) : null,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {erro && (
              <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-800">{erro}</p>
              </div>
            )}
          </div>

          {/* Footer fixo: Limpar reseta sem fechar, Aplicar dispara a busca e fecha */}
          <div className="flex justify-between gap-2 border-t border-slate-100 bg-slate-50 px-5 py-3 rounded-b-xl">
            <button
              onClick={handleLimpar}
              className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
            >
              Limpar
            </button>
            <button
              onClick={handleAplicar}
              disabled={carregando}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-40 transition-colors"
            >
              {carregando && <Loader2 className="h-4 w-4 animate-spin" />}
              {carregando ? "Aplicando..." : "Aplicar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
