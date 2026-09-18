import { useState, useEffect, useRef } from 'react';
import { X, MapPin, Search, Loader2, AlertCircle } from 'lucide-react';
import { useFiltroDestino } from '../model/useFiltroDestino';

type FiltrarPorDestinoModalProps = {
  onClose: () => void;
  onFiltroAplicado?: (resultado: any[]) => void;
};

export function FiltrarPorDestinoModal({
  onClose,
  onFiltroAplicado,
}: FiltrarPorDestinoModalProps) {
  const [destinoSelecionado, setDestinoSelecionado] = useState('');
  const { carregando, erro, aplicarFiltro } = useFiltroDestino(onFiltroAplicado);
  const inputRef = useRef<HTMLInputElement>(null);

  // Foca o input assim que o modal abre
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Fecha com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleAplicar = async () => {
    if (!destinoSelecionado.trim()) return;
    await aplicarFiltro(destinoSelecionado);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAplicar();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Filtrar por destino
              </h2>
              <p className="text-sm text-slate-500">
                Veja a demanda de viagens por rota
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
        <div className="px-6 py-5">
          <label
            htmlFor="destino"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Destino ou região
          </label>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              ref={inputRef}
              id="destino"
              type="text"
              placeholder="Ex: São Paulo, Sul, Grande ABC..."
              value={destinoSelecionado}
              onChange={e => setDestinoSelecionado(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-shadow"
            />
          </div>

          {erro && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800">{erro}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleAplicar}
            disabled={carregando || !destinoSelecionado.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 transition-colors"
          >
            {carregando && <Loader2 className="h-4 w-4 animate-spin" />}
            {carregando ? 'Filtrando...' : 'Aplicar filtro'}
          </button>
        </div>
      </div>
    </div>
  );
}