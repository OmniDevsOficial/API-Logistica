import { useState } from 'react';
import { FiltrarPorDestinoModal } from './FiltrarPorDestinoModal';

export function FiltrarPorDestinoButton() {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <>
      <button
        onClick={() => setModalAberto(true)}
        className="inline-flex items-center gap-2 whitespace-nowrap px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
      >
        <span aria-hidden>🔍</span>
        Filtrar por Destino
      </button>

      {modalAberto && (
        <FiltrarPorDestinoModal onClose={() => setModalAberto(false)} />
      )}
    </>
  );
}