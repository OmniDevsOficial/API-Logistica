import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { FiltrarViagensModal } from "./FiltrarViagensModal";
import type { FiltroViagens } from "../model/types";

type FiltrarViagensButtonProps = {
  onFiltroAplicado?: (resultado: any[]) => void;
  onFiltroLimpo?: () => void;
  filtroModal: FiltroViagens;
  onFiltroModalChange: (filtro: FiltroViagens) => void;
  buttonClassName?: string;
};

export function FiltrarViagensButton({
  onFiltroAplicado,
  onFiltroLimpo,
  filtroModal,
  onFiltroModalChange,
  buttonClassName,
}: FiltrarViagensButtonProps) {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <>
      <button
        onClick={() => setModalAberto(true)}
        className={
          buttonClassName ??
          "inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-slate-300 bg-surface px-4 py-2 text-sm font-medium text-fg shadow-sm hover:bg-background hover:border-slate-400 transition-colors dark:border-border"
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
          filtroModal={filtroModal}
          onFiltroModalChange={onFiltroModalChange}
        />
      )}
    </>
  );
}
