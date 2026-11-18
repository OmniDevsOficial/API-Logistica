import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PercentualCombustivel } from "@entities/veiculo";
import { formatarPercentual, ROTULO_NAO_IDENTIFICADO, rotuloNome } from "../lib/frota";

interface GraficoCombustivelProps {
  combustiveis: PercentualCombustivel[];
}

interface BarraCombustivel {
  chave: string;
  rotulo: string;
  quantidade: number;
  percentual: number;
}

const COR_BARRA = "var(--color-grafico-forte)";
const COR_NEUTRA = "var(--color-fg-subtle)";
const COR_GRADE = "var(--color-border)";
const COR_CURSOR = "var(--color-background)";
const TEXTO_EIXO = { fontSize: 12, fill: "var(--color-fg-muted)" };
const TEXTO_VALOR = { fontSize: 12, fill: "var(--color-fg)", fontWeight: 600 };
const MARCACOES = [0, 25, 50, 75, 100];

function veiculosPorExtenso(quantidade: number): string {
  return quantidade === 1 ? "1 veículo" : `${quantidade} veículos`;
}

interface ConteudoTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: BarraCombustivel }>;
}

function ConteudoTooltip({ active, payload }: ConteudoTooltipProps) {
  const barra = payload?.[0]?.payload;
  if (!active || !barra) return null;

  return (
    <div className="flex flex-col gap-0.5 rounded-md border border-border bg-surface px-3 py-2 text-[13px] shadow-sm">
      <span className="font-semibold text-fg">{barra.rotulo}</span>
      <span className="text-fg-muted">
        {formatarPercentual(barra.percentual)} da frota · {veiculosPorExtenso(barra.quantidade)}
      </span>
    </div>
  );
}

export function GraficoCombustivel({ combustiveis }: GraficoCombustivelProps) {
  const barras: BarraCombustivel[] = combustiveis.map(({ nome, quantidade, percentual }) => ({
    chave: nome,
    rotulo: rotuloNome(nome),
    quantidade,
    percentual,
  }));

  return (
    <div className="flex h-full min-h-[240px] flex-col">
      <div className="min-h-[240px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barras} margin={{ top: 24, right: 0, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke={COR_GRADE} />
            <XAxis
              dataKey="rotulo"
              tick={TEXTO_EIXO}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <YAxis
              width={44}
              domain={[0, 100]}
              ticks={MARCACOES}
              tickFormatter={(valor: number) => `${valor}%`}
              tick={TEXTO_EIXO}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<ConteudoTooltip />} cursor={{ fill: COR_CURSOR }} />
            <Bar dataKey="percentual" maxBarSize={40} radius={[4, 4, 0, 0]} isAnimationActive={false}>
              {barras.map((barra) => (
                <Cell
                  key={barra.chave}
                  fill={barra.rotulo === ROTULO_NAO_IDENTIFICADO ? COR_NEUTRA : COR_BARRA}
                />
              ))}
              <LabelList
                dataKey="percentual"
                position="top"
                formatter={(valor: unknown) => formatarPercentual(Number(valor))}
                style={TEXTO_VALOR}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <table className="sr-only">
        <caption>Combustível mais utilizado pela frota</caption>
        <thead>
          <tr>
            <th scope="col">Combustível</th>
            <th scope="col">Percentual</th>
            <th scope="col">Veículos</th>
          </tr>
        </thead>
        <tbody>
          {barras.map((barra) => (
            <tr key={barra.chave}>
              <th scope="row">{barra.rotulo}</th>
              <td>{formatarPercentual(barra.percentual)}</td>
              <td>{barra.quantidade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
