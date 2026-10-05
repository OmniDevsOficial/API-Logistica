import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RentabilidadeViagensPoint } from "@entities/dashboard-metrics";
import { formatCurrency } from "@shared/lib";

interface RentabilidadeViagensChartProps {
  data: RentabilidadeViagensPoint[];
}

const CHART_BLUE = "#2f49ff";
const GRID_COLOR = "#e5e7eb";
const AXIS_TEXT_COLOR = "#9ca3af";

function formatYTick(value: number): string {
  return value >= 1000 ? `${value / 1000}k` : `${value}`;
}

function TooltipContent({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number }[];
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[10px] border border-border bg-surface px-3 py-2 text-[13px] text-fg shadow-[0_4px_12px_var(--color-shadow)]">
      {formatCurrency(payload[0].value, 0)}
    </div>
  );
}

export function RentabilidadeViagensChart({
  data,
}: RentabilidadeViagensChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 8, right: 12, bottom: 0, left: -16 }}
      >
        <CartesianGrid vertical={false} stroke={GRID_COLOR} />
        <XAxis
          dataKey="viagensLabel"
          tickLine={false}
          axisLine={false}
          tick={{ fill: AXIS_TEXT_COLOR, fontSize: 12 }}
        />
        <YAxis
          domain={[0, 10000]}
          ticks={[0, 2000, 4000, 6000, 8000, 10000]}
          tickFormatter={formatYTick}
          tickLine={false}
          axisLine={false}
          tick={{ fill: AXIS_TEXT_COLOR, fontSize: 12 }}
        />
        <Tooltip content={<TooltipContent />} cursor={{ stroke: GRID_COLOR }} />
        <Line
          type="monotone"
          dataKey="rentabilidade"
          stroke={CHART_BLUE}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 5, fill: CHART_BLUE }}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
