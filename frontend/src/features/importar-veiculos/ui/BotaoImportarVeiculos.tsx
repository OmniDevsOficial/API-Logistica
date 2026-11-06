import { useState } from "react";
import { Truck } from "lucide-react";
import type { ResultadoImportacaoVeiculos } from "../api/importarVeiculos";
import { ModalImportarVeiculos } from "./ModalImportarVeiculos";

interface BotaoImportarVeiculosProps {
  onImportado?: (resultado: ResultadoImportacaoVeiculos) => void;
  /** "secundaria" quando dividir espaço com outra ação principal (ex.: dashboard). */
  variante?: "primaria" | "secundaria";
}

const BASE =
  "inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md px-5 py-3 text-sm font-semibold transition-colors duration-150";
const VARIANTES = {
  primaria: `${BASE} bg-primary text-white hover:bg-primary-dark`,
  secundaria: `${BASE} border border-primary bg-surface text-primary hover:bg-primary hover:text-white`,
} as const;

/** Abre o modal de importação do CSV de veículos (gestor e operador, ver `podeImportarVeiculos`). */
export function BotaoImportarVeiculos({
  onImportado,
  variante = "primaria",
}: BotaoImportarVeiculosProps) {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <>
      <button
        type="button"
        className={VARIANTES[variante]}
        onClick={() => setModalAberto(true)}
      >
        <Truck size={16} aria-hidden="true" />
        Importar veículos
      </button>

      {modalAberto && (
        <ModalImportarVeiculos onFechar={() => setModalAberto(false)} onImportado={onImportado} />
      )}
    </>
  );
}
