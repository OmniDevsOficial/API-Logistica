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

const SINCRONIA = "rentabilidade-viagens";
const COR_BARRA = "var(--color-primary)";
const COR_GRADE = "var(--color-border)";
const COR_EIXO = "var(--color-fg-muted)";
const COR_ZERO = "var(--color-fg-subtle)";
const COR_CURSOR = "var(--color-background)";
const LARGURA_EIXO_Y = 72;
const TEXTO_EIXO = { fontSize: 12, fill: COR_EIXO };
const MARGEM = { top: 8, right: 0, bottom: 8, left: 0 };

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
      <span className="font-semibold text-fg">{formatCurrencyBRL(ponto.rentabilidade, 2)}</span>
      <span className="text-fg-muted">{viagensPorExtenso(ponto.viagens)}</span>
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

  const tooltip = <ConteudoTooltip agrupamento={agrupamento} />;
  const rentabilidades = pontos.map((ponto) => ponto.rentabilidade);
  const marcacoesRentabilidade = marcacoes(Math.max(...rentabilidades), false);
  const menorRentabilidade = Math.min(0, ...rentabilidades);
  const marcacoesViagens = marcacoes(Math.max(...pontos.map((ponto) => ponto.viagens)), true);

  return (
    <div className="flex h-full min-h-[260px] flex-col gap-2">
      <span className="text-xs font-medium text-fg-muted">Rentabilidade</span>
      <div className="min-h-[110px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={pontos} syncId={SINCRONIA} margin={MARGEM}>
            <CartesianGrid vertical={false} stroke={COR_GRADE} />
            <XAxis dataKey="rotulo" hide />
            <YAxis
              width={LARGURA_EIXO_Y}
              tickFormatter={moedaCompacta}
              ticks={marcacoesRentabilidade}
              domain={[menorRentabilidade, marcacoesRentabilidade[marcacoesRentabilidade.length - 1]]}
              interval={0}
              tick={TEXTO_EIXO}
              axisLine={false}
              tickLine={false}
            />
            <ReferenceLine y={0} stroke={COR_ZERO} />
            <Tooltip content={tooltip} cursor={{ fill: COR_CURSOR }} />
            <Bar dataKey="rentabilidade" fill={COR_BARRA} maxBarSize={24} radius={[4, 4, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <span className="text-xs font-medium text-fg-muted">Viagens</span>
      <div className="min-h-[110px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={pontos} syncId={SINCRONIA} margin={MARGEM}>
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
              width={LARGURA_EIXO_Y}
              ticks={marcacoesViagens}
              domain={[0, marcacoesViagens[marcacoesViagens.length - 1]]}
              interval={0}
              tick={TEXTO_EIXO}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={() => null} cursor={{ fill: COR_CURSOR }} />
            <Bar dataKey="viagens" fill={COR_BARRA} maxBarSize={24} radius={[4, 4, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <table className="sr-only">
        <caption>Rentabilidade e viagens por {agrupamento === "DIA" ? "dia" : "mês"}</caption>
        <thead>
          <tr>
            <th scope="col">{agrupamento === "DIA" ? "Dia" : "Mês"}</th>
            <th scope="col">Rentabilidade</th>
            <th scope="col">Viagens</th>
          </tr>
        </thead>
        <tbody>
          {pontos.map((ponto) => (
            <tr key={ponto.rotulo}>
              <th scope="row">{rotuloDoTooltip(ponto.rotulo, agrupamento)}</th>
              <td>{formatCurrencyBRL(ponto.rentabilidade, 2)}</td>
              <td>{ponto.viagens}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
