import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  PontoRentabilidade,
  SerieRentabilidade,
} from "@entities/dashboard-metrics";
import { formatCurrencyBRL } from "@shared/lib";
import { GraficoSemDados } from "./GraficoSemDados";
import { marcacoes, rotuloDoEixo, rotuloDoTooltip } from "../lib/eixoDoGrafico";

interface GraficoRentabilidadeViagensProps {
  serie: SerieRentabilidade;
}

const COR_CUSTO = "var(--color-grafico-forte)";
const COR_RENTABILIDADE = "var(--color-grafico-claro)";
const COR_SUPERFICIE = "var(--color-surface)";
const COR_GRADE = "var(--color-border)";
const COR_EIXO = "var(--color-fg-muted)";
const COR_ZERO = "var(--color-fg-subtle)";
const COR_CURSOR = "var(--color-background)";
const TEXTO_EIXO = { fontSize: 12, fill: COR_EIXO };
const MARGEM = { top: 8, right: 0, bottom: 0, left: 0 };

const LEGENDA = [
  { nome: "Custo", cor: COR_CUSTO },
  { nome: "Rentabilidade", cor: COR_RENTABILIDADE },
];

function moedaCompacta(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    maximumFractionDigits: 1,
  });
}

function viagensPorExtenso(viagens: number): string {
  return viagens === 1 ? "1 viagem" : `${viagens} viagens`;
}

interface LinhaTooltipProps {
  cor?: string;
  nome: string;
  valor: string;
}

function LinhaTooltip({ cor, nome, valor }: LinhaTooltipProps) {
  return (
    <div className="flex items-center gap-2">
      {cor ? (
        <span className="h-0.5 w-3 rounded-full" style={{ backgroundColor: cor }} />
      ) : (
        <span className="w-3" />
      )}
      <span className="font-semibold text-fg">{valor}</span>
      <span className="text-fg-muted">{nome}</span>
    </div>
  );
}

interface ConteudoTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: PontoRentabilidade }>;
  agrupamento: SerieRentabilidade["agrupamento"];
}

function ConteudoTooltip({ active, payload, agrupamento }: ConteudoTooltipProps) {
  const ponto = payload?.[0]?.payload;
  if (!active || !ponto) return null;

  return (
    <div className="flex flex-col gap-1 rounded-md border border-border bg-surface px-3 py-2 text-[13px] shadow-sm">
      <span className="text-fg-muted">{rotuloDoTooltip(ponto.rotulo, agrupamento)}</span>
      <LinhaTooltip
        nome="Valor dos fretes"
        valor={formatCurrencyBRL(ponto.custo + ponto.rentabilidade, 2)}
      />
      <LinhaTooltip cor={COR_CUSTO} nome="Custo" valor={formatCurrencyBRL(ponto.custo, 2)} />
      <LinhaTooltip
        cor={COR_RENTABILIDADE}
        nome="Rentabilidade"
        valor={formatCurrencyBRL(ponto.rentabilidade, 2)}
      />
      <span className="pl-5 text-fg-muted">{viagensPorExtenso(ponto.viagens)}</span>
    </div>
  );
}

export function GraficoRentabilidadeViagens({ serie }: GraficoRentabilidadeViagensProps) {
  const { agrupamento, pontos } = serie;
  const totalViagens = pontos.reduce((soma, ponto) => soma + ponto.viagens, 0);

  if (totalViagens === 0) {
    return <GraficoSemDados />;
  }

  if (pontos.length < 2) {
    return (
      <div className="flex h-full min-h-[200px] items-center justify-center text-center text-sm text-fg-subtle">
        Selecione um mês ou um ano para ver a evolução.
      </div>
    );
  }

  const maiorBarra = Math.max(
    ...pontos.map((ponto) => ponto.custo + Math.max(ponto.rentabilidade, 0)),
  );
  const menorBarra = Math.min(0, ...pontos.map((ponto) => ponto.rentabilidade));
  const marcacoesEixo = marcacoes(maiorBarra, false);
  const tetoEixo = marcacoesEixo[marcacoesEixo.length - 1];

  return (
    <div className="flex h-full min-h-[260px] flex-col gap-3">
      <ul className="flex justify-end gap-4 text-xs text-fg-muted">
        {LEGENDA.map(({ nome, cor }) => (
          <li key={nome} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[3px]" style={{ backgroundColor: cor }} />
            {nome}
          </li>
        ))}
      </ul>

      <div className="min-h-[220px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={pontos} margin={MARGEM}>
            <CartesianGrid vertical={false} stroke={COR_GRADE} />
            <XAxis
              dataKey="rotulo"
              tickFormatter={(rotulo: string) => rotuloDoEixo(rotulo, agrupamento)}
              tick={TEXTO_EIXO}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={8}
            />
            <YAxis
              width={72}
              tickFormatter={moedaCompacta}
              ticks={marcacoesEixo}
              domain={[menorBarra, tetoEixo]}
              interval={0}
              tick={TEXTO_EIXO}
              axisLine={false}
              tickLine={false}
            />
            {menorBarra < 0 && <ReferenceLine y={0} stroke={COR_ZERO} />}
            <Tooltip
              content={<ConteudoTooltip agrupamento={agrupamento} />}
              cursor={{ fill: COR_CURSOR }}
            />
            <Bar
              dataKey="custo"
              stackId="valor"
              fill={COR_CUSTO}
              stroke={COR_SUPERFICIE}
              strokeWidth={1}
              maxBarSize={24}
              isAnimationActive={false}
            />
            <Bar
              dataKey="rentabilidade"
              stackId="valor"
              fill={COR_RENTABILIDADE}
              stroke={COR_SUPERFICIE}
              strokeWidth={1}
              maxBarSize={24}
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <table className="sr-only">
        <caption>Custo e rentabilidade por {agrupamento === "DIA" ? "dia" : "mês"}</caption>
        <thead>
          <tr>
            <th scope="col">{agrupamento === "DIA" ? "Dia" : "Mês"}</th>
            <th scope="col">Custo</th>
            <th scope="col">Rentabilidade</th>
            <th scope="col">Viagens</th>
          </tr>
        </thead>
        <tbody>
          {pontos.map((ponto) => (
            <tr key={ponto.rotulo}>
              <th scope="row">{rotuloDoTooltip(ponto.rotulo, agrupamento)}</th>
              <td>{formatCurrencyBRL(ponto.custo, 2)}</td>
              <td>{formatCurrencyBRL(ponto.rentabilidade, 2)}</td>
              <td>{ponto.viagens}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
