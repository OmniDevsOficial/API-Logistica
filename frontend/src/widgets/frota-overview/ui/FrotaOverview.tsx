import type { ResumoFrota } from "@entities/veiculo";
import { ChartCard, StatCard } from "@shared/ui";
import {
  barrasComOutras,
  formatarPercentual,
  percentualDe,
  rotuloNome,
  rotuloTipo,
} from "../lib/frota";
import { GraficoCombustivel } from "./GraficoCombustivel";
import { GraficoQuantidades } from "./GraficoQuantidades";

interface FrotaOverviewProps {
  resumo: ResumoFrota;
}

const LIMITE_TIPOS = 10;
const LIMITE_MARCAS = 8;
const SEM_DADO = "-";

function SemDados() {
  return (
    <div className="flex h-full min-h-[200px] items-center justify-center text-center text-sm text-fg-subtle">
      Sem dados para exibir.
    </div>
  );
}

export function FrotaOverview({ resumo }: FrotaOverviewProps) {
  const combustivelPrincipal = resumo.porCombustivel[0] ?? null;
  const tipos = barrasComOutras(resumo.porTipo, rotuloTipo, LIMITE_TIPOS);
  const marcas = barrasComOutras(resumo.porMarca, rotuloNome, LIMITE_MARCAS);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de veículos"
          value={String(resumo.totalVeiculos)}
          caption="Cadastrados pela planilha"
          highlighted
        />
        <StatCard
          title="Veículos sem motorista"
          value={String(resumo.veiculosSemMotorista)}
          caption={
            resumo.possuiDados
              ? `${formatarPercentual(percentualDe(resumo.veiculosSemMotorista, resumo.totalVeiculos))} da frota`
              : "Da frota"
          }
        />
        <StatCard
          title="Motoristas com veículo"
          value={String(resumo.motoristasComVeiculo)}
          caption="Com ao menos um veículo"
        />
        <StatCard
          title="Combustível mais usado"
          value={combustivelPrincipal ? rotuloNome(combustivelPrincipal.nome) : SEM_DADO}
          caption={
            combustivelPrincipal
              ? `${formatarPercentual(combustivelPrincipal.percentual)} da frota`
              : "Da frota"
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Veículos por tipo">
          {tipos.length > 0 ? (
            <GraficoQuantidades
              barras={tipos}
              descricao="Quantidade de veículos por tipo"
              rotuloColuna="Tipo"
            />
          ) : (
            <SemDados />
          )}
        </ChartCard>

        <ChartCard title="Combustível mais utilizado (%)">
          {resumo.porCombustivel.length > 0 ? (
            <GraficoCombustivel combustiveis={resumo.porCombustivel} />
          ) : (
            <SemDados />
          )}
        </ChartCard>

        <ChartCard title="Marcas usadas pelos motoristas" className="lg:col-span-2">
          {marcas.length > 0 ? (
            <GraficoQuantidades
              barras={marcas}
              descricao="Quantidade de veículos com motorista por marca"
              rotuloColuna="Marca"
            />
          ) : (
            <SemDados />
          )}
        </ChartCard>
      </div>
    </div>
  );
}
