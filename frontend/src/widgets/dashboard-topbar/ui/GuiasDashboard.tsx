import type { ComponentType } from "react";
import { LayoutGrid, Truck } from "lucide-react";

export type GuiaDashboard = "inicio" | "veiculos";

interface GuiasDashboardProps {
  guia: GuiaDashboard;
  onGuiaChange: (guia: GuiaDashboard) => void;
}

const GUIAS: {
  valor: GuiaDashboard;
  rotulo: string;
  Icone: ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
}[] = [
  { valor: "inicio", rotulo: "Visão geral", Icone: LayoutGrid },
  { valor: "veiculos", rotulo: "Veículos", Icone: Truck },
];

const GUIA_BASE =
  "inline-flex flex-1 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2.5 text-sm font-medium transition-colors duration-150 sm:flex-none";
const GUIA_ATIVA = `${GUIA_BASE} bg-primary font-semibold text-white`;
const GUIA_INATIVA = `${GUIA_BASE} text-fg-muted hover:bg-background hover:text-fg`;

export function GuiasDashboard({ guia, onGuiaChange }: GuiasDashboardProps) {
  return (
    <div
      role="tablist"
      aria-label="Guias do dashboard"
      className="flex w-full gap-1 rounded-[12px] bg-surface p-1 sm:inline-flex sm:w-auto"
    >
      {GUIAS.map(({ valor, rotulo, Icone }) => (
        <button
          key={valor}
          type="button"
          role="tab"
          id={`guia-${valor}`}
          aria-selected={guia === valor}
          className={guia === valor ? GUIA_ATIVA : GUIA_INATIVA}
          onClick={() => onGuiaChange(valor)}
        >
          <Icone size={16} aria-hidden />
          {rotulo}
        </button>
      ))}
    </div>
  );
}
