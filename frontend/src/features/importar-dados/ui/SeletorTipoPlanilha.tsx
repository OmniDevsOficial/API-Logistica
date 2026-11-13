import { FileSpreadsheet, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { TipoPlanilha } from "@shared/lib";

interface SeletorTipoPlanilhaProps {
  tipo: TipoPlanilha;
  onChange: (tipo: TipoPlanilha) => void;
  bloqueado: boolean;
}

const OPCOES: ReadonlyArray<{ tipo: TipoPlanilha; rotulo: string; Icone: LucideIcon }> = [
  { tipo: "manifesto", rotulo: "Importar manifesto", Icone: FileSpreadsheet },
  { tipo: "veiculos", rotulo: "Importar veículos", Icone: Truck },
];

export function SeletorTipoPlanilha({ tipo, onChange, bloqueado }: SeletorTipoPlanilhaProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Tipo de planilha"
      className="grid grid-cols-2 gap-1 rounded-full bg-background p-1"
    >
      {OPCOES.map(({ tipo: opcao, rotulo, Icone }) => {
        const selecionado = opcao === tipo;

        return (
          <button
            key={opcao}
            type="button"
            role="radio"
            aria-checked={selecionado}
            disabled={bloqueado}
            onClick={() => onChange(opcao)}
            className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-3 py-2.5 text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed ${
              selecionado
                ? "bg-primary text-white shadow-sm"
                : "text-fg-muted enabled:hover:text-fg"
            }`}
          >
            <Icone size={16} aria-hidden="true" className="hidden shrink-0 sm:block" />
            {rotulo}
          </button>
        );
      })}
    </div>
  );
}
