// src/features/enviar-relatorio/ui/BotaoEnviarRelatorio.tsx
import { useState } from 'react';
import { Upload } from 'lucide-react';

import { ModalEnviarRelatorio } from './ModalEnviarRelatorio';

export function BotaoEnviarRelatorio() {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <div>
      <button
        type="button"
        className="
          inline-flex cursor-pointer items-center gap-2
          rounded-full border-0 bg-[#3355FF]
          px-6 py-2.5
          text-[15px] font-semibold text-white
          transition-colors duration-150
          hover:bg-[#2444E0]
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-[#3355FF]
        "
        onClick={() => setModalAberto(true)}
      >
        <Upload className="h-[18px] w-[18px]" />
        Upload
      </button>

      {modalAberto && (
        <ModalEnviarRelatorio
          onFechar={() => setModalAberto(false)}
        />
      )}
    </div>
  );
}