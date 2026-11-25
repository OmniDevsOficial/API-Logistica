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
import { ROTULO_NAO_IDENTIFICADO, type BarraFrota } from "../lib/frota";

interface GraficoQuantidadesProps {
  barras: BarraFrota[];
  descricao: string;
  rotuloColuna: string;
}

const COR_BARRA = "var(--color-grafico-forte)";
const COR_NEUTRA = "var(--color-fg-subtle)";
const COR_GRADE = "var(--color-border)";
const COR_CURSOR = "var(--color-background)";
const TEXTO_EIXO = { fontSize: 12, fill: "var(--color-fg-muted)" };
const TEXTO_VALOR = { fontSize: 12, fill: "var(--color-fg)", fontWeight: 600 };
const ALTURA_POR_BARRA = 36;
const LARGURA_ROTULO = 128;

function veiculosPorExtenso(quantidade: number): string {
  return quantidade === 1 ? "1 veículo" : `${quantidade} veículos`;
}

interface ConteudoTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: BarraFrota }>;
}

function ConteudoTooltip({ active, payload }: ConteudoTooltipProps) {
  const barra = payload?.[0]?.payload;
  if (!active || !barra) return null;

  return (
    <div className="flex flex-col gap-0.5 rounded-md border border-border bg-surface px-3 py-2 text-[13px] shadow-sm">
      <span className="font-semibold text-fg">{barra.rotulo}</span>
      <span className="text-fg-muted">{veiculosPorExtenso(barra.quantidade)}</span>
    </div>
  );
}

export function GraficoQuantidades({ barras, descricao, rotuloColuna }: GraficoQuantidadesProps) {
  const altura = Math.max(200, barras.length * ALTURA_POR_BARRA + 16);

  return (
    <div className="flex h-full flex-col">
      <div style={{ height: altura }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={barras}
            layout="vertical"
            margin={{ top: 0, right: 36, bottom: 0, left: 0 }}
            barCategoryGap={6}
          >
            <CartesianGrid horizontal={false} stroke={COR_GRADE} />
            <XAxis type="number" hide allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="rotulo"
              width={LARGURA_ROTULO}
              tick={TEXTO_EIXO}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <Tooltip content={<ConteudoTooltip />} cursor={{ fill: COR_CURSOR }} />
            <Bar
              dataKey="quantidade"
              maxBarSize={24}
              radius={[0, 4, 4, 0]}
              isAnimationActive={false}
            >
              {barras.map((barra) => (
                <Cell
                  key={barra.chave}
                  fill={barra.rotulo === ROTULO_NAO_IDENTIFICADO ? COR_NEUTRA : COR_BARRA}
                />
              ))}
              <LabelList dataKey="quantidade" position="right" style={TEXTO_VALOR} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <table className="sr-only">
        <caption>{descricao}</caption>
        <thead>
          <tr>
            <th scope="col">{rotuloColuna}</th>
            <th scope="col">Veículos</th>
          </tr>
        </thead>
        <tbody>
          {barras.map((barra) => (
            <tr key={barra.chave}>
              <th scope="row">{barra.rotulo}</th>
              <td>{barra.quantidade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
