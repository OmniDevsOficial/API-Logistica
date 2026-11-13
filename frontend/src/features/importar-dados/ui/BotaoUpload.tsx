import { useState } from "react";
import { Upload } from "lucide-react";
import type { TipoPlanilha } from "@shared/lib";
import type { ResultadoImportacao } from "../../enviar-relatorio/api/importarManifesto";
import type { ResultadoImportacaoVeiculos } from "../../importar-veiculos/api/importarVeiculos";
import { ModalImportarDados } from "./ModalImportarDados";

interface BotaoUploadProps {
  tipoInicial?: TipoPlanilha;
  onManifestoImportado?: (resultado: ResultadoImportacao) => void;
  onVeiculosImportados?: (resultado: ResultadoImportacaoVeiculos) => void;
}

export function BotaoUpload({
  tipoInicial,
  onManifestoImportado,
  onVeiculosImportados,
}: BotaoUploadProps) {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <>
      <button
        type="button"
        className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-dark"
        onClick={() => setModalAberto(true)}
      >
        <Upload size={16} aria-hidden="true" />
        Upload
      </button>

      {modalAberto && (
        <ModalImportarDados
          tipoInicial={tipoInicial}
          onFechar={() => setModalAberto(false)}
          onManifestoImportado={onManifestoImportado}
          onVeiculosImportados={onVeiculosImportados}
        />
      )}
    </>
  );
}
