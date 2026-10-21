import { useState } from "react";
import { Upload } from "lucide-react";
import type { ResultadoImportacao } from "../api/importarManifesto";
import { ModalEnviarRelatorio } from "./ModalEnviarRelatorio";

interface BotaoEnviarRelatorioProps {
  onImportado?: (resultado: ResultadoImportacao) => void;
}

export function BotaoEnviarRelatorio({
  onImportado,
}: BotaoEnviarRelatorioProps) {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <div>
      <button
        type="button"
        className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-dark"
        onClick={() => setModalAberto(true)}
      >
        <Upload size={16} />
        Upload
      </button>

      {modalAberto && (
        <ModalEnviarRelatorio
          onFechar={() => setModalAberto(false)}
          onImportado={onImportado}
        />
      )}
    </div>
  );
}