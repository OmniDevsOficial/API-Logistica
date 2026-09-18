import { useState } from 'react';
import { useFiltroDestino } from '../model/useFiltroDestino';

interface FiltrarPorDestinoModalProps {
  onClose: () => void;
  onFiltroAplicado?: (resultado: any[]) => void;
}

export function FiltrarPorDestinoModal({
  onClose,
  onFiltroAplicado,
}: FiltrarPorDestinoModalProps) {
  const [destinoSelecionado, setDestinoSelecionado] = useState('');
  const { carregando, erro, aplicarFiltro } = useFiltroDestino(onFiltroAplicado);

  const handleAplicar = async () => {
    if (!destinoSelecionado.trim()) return;
    await aplicarFiltro(destinoSelecionado);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Filtrar por Destino
        </h2>

        <input
          type="text"
          placeholder="Digite o destino ou região..."
          value={destinoSelecionado}
          onChange={e => setDestinoSelecionado(e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        {erro && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg">
            {erro}
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleAplicar}
            disabled={carregando}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {carregando ? 'Filtrando...' : 'Aplicar'}
          </button>
        </div>
      </div>
    </div>
  );
}