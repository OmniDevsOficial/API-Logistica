import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Text,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RentabilidadeTipoVeiculo } from "@entities/dashboard-metrics";
import { formatCurrencyBRL } from "@shared/lib";
import { moedaCompacta } from "../lib/eixoDoGrafico";
import {
  barrasDoGrafico,
  eixoDoGrafico,
  LEGENDA_NAO_IDENTIFICADO,
  type BarraTipoVeiculo,
  type DestaqueDaBarra,
} from "../lib/rentabilidadePorTipo";

interface GraficoRentabilidadePorTipoProps {
  tipos: RentabilidadeTipoVeiculo[];
}

const COR_POR_DESTAQUE: Record<DestaqueDaBarra, string> = {
  positivo: "var(--color-grafico-forte)",
  negativo: "var(--color-alerta)",
  neutro: "var(--color-fg-subtle)",
};
const COR_SUPERFICIE = "var(--color-surface)";
const COR_GRADE = "var(--color-border)";
const COR_EIXO = "var(--color-fg-muted)";
const COR_ZERO = "var(--color-fg-subtle)";
const COR_CURSOR = "var(--color-background)";
const TEXTO_EIXO = { fontSize: 12, fill: COR_EIXO };
const MARGEM = { top: 8, right: 0, bottom: 0, left: 0 };
const ESPACO_ENTRE_ROTULOS = 8;

function viagensPorExtenso(viagens: number): string {
  return viagens === 1 ? "1 viagem" : `${viagens} viagens`;
}

function moedaOuTraco(valor: number | null): string {
  return valor === null ? "-" : formatCurrencyBRL(valor, 2);
}

interface RotuloDoTipoProps {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  visibleTicksCount?: number;
  payload?: { value?: string };
}

function RotuloDoTipo({ x, y, width, visibleTicksCount, payload }: RotuloDoTipoProps) {
  const larguraDaColuna = Number(width) / Math.max(visibleTicksCount ?? 1, 1);

  return (
    <Text
      x={Number(x)}
      y={Number(y)}
      width={Math.max(larguraDaColuna - ESPACO_ENTRE_ROTULOS, 40)}
      textAnchor="middle"
      verticalAnchor="start"
      {...TEXTO_EIXO}
    >
      {payload?.value ?? ""}
    </Text>
  );
}

interface LinhaTooltipProps {
  nome: string;
  valor: string;
  destaque?: boolean;
}

function LinhaTooltip({ nome, valor, destaque = false }: LinhaTooltipProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-fg-muted">{nome}</span>
      <span className={destaque ? "font-semibold text-alerta" : "font-semibold text-fg"}>
        {valor}
      </span>
    </div>
  );
}

interface ConteudoTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: BarraTipoVeiculo }>;
}

function ConteudoTooltip({ active, payload }: ConteudoTooltipProps) {
  const barra = payload?.[0]?.payload;
  if (!active || !barra) return null;

  const negativa = barra.rentabilidade < 0;

  return (
    <div className="flex min-w-[220px] flex-col gap-1 rounded-md border border-border bg-surface px-3 py-2 text-[13px] shadow-sm">
      <span className="font-semibold text-fg">{barra.rotulo}</span>
      {barra.naoIdentificado && (
        <span className="text-fg-muted">{LEGENDA_NAO_IDENTIFICADO}</span>
      )}
      <LinhaTooltip nome="Receita" valor={formatCurrencyBRL(barra.receita, 2)} />
      <LinhaTooltip nome="Custo" valor={formatCurrencyBRL(barra.custo, 2)} />
      <LinhaTooltip
        nome="Rentabilidade"
        valor={formatCurrencyBRL(barra.rentabilidade, 2)}
        destaque={negativa}
      />
      <LinhaTooltip
        nome="Média por viagem"
        valor={moedaOuTraco(barra.mediaPorViagem)}
        destaque={(barra.mediaPorViagem ?? 0) < 0}
      />
      <span className="text-fg-muted">{viagensPorExtenso(barra.viagens)}</span>
    </div>
  );
}

interface ItemLegendaProps {
  cor: string;
  texto: string;
}

function ItemLegenda({ cor, texto }: ItemLegendaProps) {
  return (
    <li className="flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ backgroundColor: cor }} />
      {texto}
    </li>
  );
}

export function GraficoRentabilidadePorTipo({ tipos }: GraficoRentabilidadePorTipoProps) {
  const barras = barrasDoGrafico(tipos);
  const { dominio, marcacoes } = eixoDoGrafico(barras.map((barra) => barra.rentabilidade));
  const temNegativa = barras.some((barra) => barra.destaque === "negativo");
  const temNaoIdentificado = barras.some((barra) => barra.destaque === "neutro");

  return (
    <div className="flex h-full min-h-[280px] flex-col gap-3">
      <ul className="flex flex-wrap justify-end gap-x-4 gap-y-1 text-xs text-fg-muted">
        <ItemLegenda cor={COR_POR_DESTAQUE.positivo} texto="Rentabilidade" />
        {temNegativa && <ItemLegenda cor={COR_POR_DESTAQUE.negativo} texto="Rentabilidade negativa" />}
        {temNaoIdentificado && (
          <ItemLegenda cor={COR_POR_DESTAQUE.neutro} texto={LEGENDA_NAO_IDENTIFICADO} />
        )}
      </ul>

      <div className="min-h-[240px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barras} margin={MARGEM}>
            <CartesianGrid vertical={false} stroke={COR_GRADE} />
            <XAxis
              dataKey="rotulo"
              tick={<RotuloDoTipo />}
              height={48}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <YAxis
              width={72}
              tickFormatter={moedaCompacta}
              ticks={marcacoes}
              domain={dominio}
              interval={0}
              tick={TEXTO_EIXO}
              axisLine={false}
              tickLine={false}
            />
            {dominio[0] < 0 && <ReferenceLine y={0} stroke={COR_ZERO} />}
            <Tooltip content={<ConteudoTooltip />} cursor={{ fill: COR_CURSOR }} />
            <Bar
              dataKey="rentabilidade"
              stroke={COR_SUPERFICIE}
              strokeWidth={1}
              maxBarSize={40}
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            >
              {barras.map((barra) => (
                <Cell key={barra.tipo} fill={COR_POR_DESTAQUE[barra.destaque]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <table className="sr-only">
        <caption>Rentabilidade por tipo de veículo</caption>
        <thead>
          <tr>
            <th scope="col">Tipo</th>
            <th scope="col">Receita</th>
            <th scope="col">Custo</th>
            <th scope="col">Rentabilidade</th>
            <th scope="col">Média por viagem</th>
            <th scope="col">Viagens</th>
          </tr>
        </thead>
        <tbody>
          {barras.map((barra) => (
            <tr key={barra.tipo}>
              <th scope="row">{barra.rotulo}</th>
              <td>{formatCurrencyBRL(barra.receita, 2)}</td>
              <td>{formatCurrencyBRL(barra.custo, 2)}</td>
              <td>{formatCurrencyBRL(barra.rentabilidade, 2)}</td>
              <td>{moedaOuTraco(barra.mediaPorViagem)}</td>
              <td>{barra.viagens}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
