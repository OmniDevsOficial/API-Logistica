import type { RentabilidadeTipoVeiculo } from "@entities/dashboard-metrics";
import { ChartCard } from "@shared/ui";
import { GraficoRentabilidadePorTipo } from "./GraficoRentabilidadePorTipo";

export interface EstadoRentabilidadePorTipo {
  mes: string;
  dados: RentabilidadeTipoVeiculo[] | null;
  carregando: boolean;
  erro: string | null;
  recarregar: () => void;
}

interface CardRentabilidadePorTipoProps {
  estado: EstadoRentabilidadePorTipo;
  className?: string;
}

const AREA_DO_ESTADO =
  "flex h-full min-h-[280px] flex-col items-center justify-center gap-3 text-center text-sm";

function Conteudo({ estado }: { estado: EstadoRentabilidadePorTipo }) {
  const { dados, carregando, erro, recarregar } = estado;

  if (carregando) {
    return (
      <p role="status" className={`${AREA_DO_ESTADO} text-fg-subtle`}>
        Carregando rentabilidade por veículo...
      </p>
    );
  }

  if (erro) {
    return (
      <div role="alert" className={AREA_DO_ESTADO}>
        <p className="text-alerta">{erro}</p>
        <button
          type="button"
          onClick={recarregar}
          className="cursor-pointer rounded-full border border-border px-4 py-1.5 text-sm font-medium text-fg hover:bg-background"
        >
          Tentar de novo
        </button>
      </div>
    );
  }

  if (!dados || dados.length === 0) {
    return (
      <p className={`${AREA_DO_ESTADO} text-3xl font-semibold text-fg`} aria-label="Sem viagens no mês">
        -
      </p>
    );
  }

  return <GraficoRentabilidadePorTipo tipos={dados} />;
}

export function CardRentabilidadePorTipo({ estado, className }: CardRentabilidadePorTipoProps) {
  return (
    <ChartCard title={`Rentabilidade por veículo · ${estado.mes}`} className={className}>
      <Conteudo estado={estado} />
    </ChartCard>
  );
}
