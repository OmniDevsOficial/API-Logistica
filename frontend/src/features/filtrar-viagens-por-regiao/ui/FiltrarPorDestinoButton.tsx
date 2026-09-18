import { useState } from 'react';
import {Funnel} from 'lucide-react'
import { FiltrarPorDestinoModal } from './FiltrarPorDestinoModal';

export function FiltrarPorDestinoButton() {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <>
      <button
        onClick={() => setModalAberto(true)}
        className="inline-flex items-center gap-2 whitespace-nowrap px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
      >
        <Funnel />
        Filtrar Viagem
      </button>

      {modalAberto && (
        <FiltrarPorDestinoModal onClose={() => setModalAberto(false)} />
      )}
    </>
  );
}