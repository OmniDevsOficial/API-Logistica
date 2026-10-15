import type { DashboardData, PeriodOption } from "@entities/dashboard-metrics";
import { ChartCard, StatCard } from "@shared/ui";
import { formatCurrencyBRL, formatPercent } from "@shared/lib";
import { GraficoSemDados } from "./GraficoSemDados";
import { useDisponiveis } from "../model/useDisponiveis";

interface DashboardOverviewProps {
  data: DashboardData;
  period: PeriodOption;
}

const SEM_DADO = "-";

function moeda(valor: number | null): string {
  return valor === null ? SEM_DADO : formatCurrencyBRL(valor, 2);
}

function porcentagem(valor: number | null): string {
  return valor === null ? SEM_DADO : formatPercent(valor);
}

function quantidade(valor: number | null): string {
  return valor === null ? SEM_DADO : String(valor);
}

export function DashboardOverview({ data, period }: DashboardOverviewProps) {
  const { metrics } = data;
  const disponiveis = useDisponiveis(period);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[minmax(150px,auto)]">
      <StatCard
        className="lg:col-start-1 lg:row-start-1"
        title="Rentabilidade total"
        value={moeda(metrics.rentabilidadeTotal)}
        caption="No período"
        highlighted
      />
      <StatCard
        className="lg:col-start-2 lg:row-start-1"
        title="Rentabilidade média"
        value={moeda(metrics.rentabilidadeMedia)}
        caption="Por viagem"
      />
      <StatCard
        className="lg:col-start-3 lg:row-start-1"
        title="Viagens"
        value={quantidade(metrics.totalViagens)}
        caption="No período"
      />
      <StatCard
        className="lg:col-start-4 lg:row-start-1"
        title="Disponíveis"
        value={quantidade(disponiveis)}
        caption="Em tempo real"
      />

      <ChartCard
        title="Rentabilidade x Viagens"
        className="sm:col-span-2 lg:col-start-1 lg:col-span-2 lg:row-start-2 lg:row-span-2"
      >
        <GraficoSemDados />
      </ChartCard>
      <StatCard
        className="sm:col-span-2 lg:col-start-3 lg:col-span-2 lg:row-start-2"
        title="Custo total"
        value={moeda(metrics.custoTotal)}
        caption="No período"
      />
      <StatCard
        className="lg:col-start-3 lg:row-start-3"
        title="Taxa de ocupação"
        value={porcentagem(metrics.taxaOcupacao)}
        caption="Frota"
      />
      <StatCard
        className="lg:col-start-4 lg:row-start-3"
        title="Tempo de alocação"
        value={SEM_DADO}
        caption="Média"
      />

      <StatCard
        className="lg:col-start-1 lg:row-start-4"
        title="Utilização da frota"
        value={SEM_DADO}
        caption="Média"
      />
      <StatCard
        className="lg:col-start-2 lg:row-start-4"
        title="Disponíveis"
        value={SEM_DADO}
        caption="Média"
      />
      <ChartCard
        title="Utilização média da frota"
        className="sm:col-span-2 lg:col-start-3 lg:col-span-2 lg:row-start-4 lg:row-span-2"
      >
        <GraficoSemDados />
      </ChartCard>
      <StatCard
        className="lg:col-start-1 lg:row-start-5"
        title="Fretes"
        value={moeda(metrics.freteTotal)}
        caption="Valor total"
      />
      <StatCard
        className="lg:col-start-2 lg:row-start-5"
        title="Custo médio"
        value={moeda(metrics.custoMedio)}
        caption="Por viagem"
      />
    </div>
  );
}
