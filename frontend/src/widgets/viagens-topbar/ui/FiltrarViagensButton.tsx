import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { FiltrarViagensModal } from "./FiltrarViagensModal";

type FiltrarViagensButtonProps = {
  onFiltroAplicado?: (resultado: any[]) => void;
  onFiltroLimpo?: () => void;
  buttonClassName?: string;
};

export function FiltrarViagensButton({
  onFiltroAplicado,
  onFiltroLimpo,
  buttonClassName,
}: FiltrarViagensButtonProps) {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <>
      <button
        onClick={() => setModalAberto(true)}
        className={
          buttonClassName ??
          "inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-400 transition-colors"
        }
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filtrar
      </button>

      {modalAberto && (
        <FiltrarViagensModal
          onClose={() => setModalAberto(false)}
          onFiltroAplicado={onFiltroAplicado}
          onFiltroLimpo={onFiltroLimpo}
        />
      )}
    </>
  );
}
