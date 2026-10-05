import type { DashboardData } from "@entities/dashboard-metrics";
import { ChartCard, StatCard } from "@shared/ui";
import { formatCurrency, formatPercent } from "@shared/lib";
import { RentabilidadeViagensChart } from "./RentabilidadeViagensChart";
import { UtilizacaoFrotaChart } from "./UtilizacaoFrotaChart";

interface DashboardOverviewProps {
  data: DashboardData;
}

export function DashboardOverview({ data }: DashboardOverviewProps) {
  const { metrics, rentabilidadeXViagens, utilizacaoMediaFrota } = data;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[minmax(150px,auto)]">
      <StatCard
        className="lg:col-start-1 lg:row-start-1"
        title="Rentabilidade total"
        value={formatCurrency(metrics.rentabilidadeTotal, 0)}
        trendLabel={`${formatPercent(metrics.rentabilidadeTotalTrendPercent)} do último mês`}
        highlighted
      />
      <StatCard
        className="lg:col-start-2 lg:row-start-1"
        title="Rentabilidade média"
        value={formatCurrency(metrics.rentabilidadeMedia)}
        caption="Por viagem"
      />
      <StatCard
        className="lg:col-start-3 lg:row-start-1"
        title="Viagens"
        value={String(metrics.viagens)}
        caption="Por mês"
      />
      <StatCard
        className="lg:col-start-4 lg:row-start-1"
        title="Disponíveis"
        value={String(metrics.disponiveis)}
        caption="Em tempo real"
      />

      <ChartCard
        title="Rentabilidade x Viagens"
        className="sm:col-span-2 lg:col-start-1 lg:col-span-2 lg:row-start-2 lg:row-span-2"
      >
        <RentabilidadeViagensChart data={rentabilidadeXViagens} />
      </ChartCard>
      <StatCard
        className="sm:col-span-2 lg:col-start-3 lg:col-span-2 lg:row-start-2"
        title="Custo total"
        value={formatCurrency(metrics.custoTotal)}
        caption="Por viagem"
      />
      <StatCard
        className="lg:col-start-3 lg:row-start-3"
        title="Taxa de ocupação"
        value={String(metrics.taxaOcupacao)}
        caption="Frota"
      />
      <StatCard
        className="lg:col-start-4 lg:row-start-3"
        title="Tempo de alocação"
        value={String(metrics.tempoAlocacaoMedia)}
        caption="Média"
      />

      <StatCard
        className="lg:col-start-1 lg:row-start-4"
        title="Utilização da frota"
        value={String(metrics.utilizacaoFrotaMedia)}
        caption="Média"
      />
      <StatCard
        className="lg:col-start-2 lg:row-start-4"
        title="Disponíveis"
        value={String(metrics.disponiveisMedia)}
        caption="Média"
      />
      <ChartCard
        title="Utilização média da frota"
        className="sm:col-span-2 lg:col-start-3 lg:col-span-2 lg:row-start-4 lg:row-span-2"
      >
        <UtilizacaoFrotaChart data={utilizacaoMediaFrota} />
      </ChartCard>
      <StatCard
        className="lg:col-start-1 lg:row-start-5"
        title="Fretes"
        value={formatCurrency(metrics.fretesValorTotal)}
        caption="Valor total"
      />
      <StatCard
        className="lg:col-start-2 lg:row-start-5"
        title="Custo médio"
        value={formatCurrency(metrics.custoMedio)}
        caption="Por viagem"
      />
    </div>
  );
}
