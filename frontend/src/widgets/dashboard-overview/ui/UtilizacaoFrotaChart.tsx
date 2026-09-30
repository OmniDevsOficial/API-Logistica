import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { UtilizacaoFrotaCategoria } from "@entities/dashboard-metrics";

interface UtilizacaoFrotaChartProps {
  data: UtilizacaoFrotaCategoria[];
}

const CHART_BLUE = "#2f49ff";
const GRID_COLOR = "#e5e7eb";
const AXIS_TEXT_COLOR = "#9ca3af";

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
      {payload[0].value}%
    </div>
  );
}

export function UtilizacaoFrotaChart({ data }: UtilizacaoFrotaChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 8, right: 12, bottom: 0, left: -16 }}
        barCategoryGap="30%"
      >
        <CartesianGrid vertical={false} stroke={GRID_COLOR} />
        <XAxis
          dataKey="categoria"
          tickLine={false}
          axisLine={false}
          tick={{ fill: AXIS_TEXT_COLOR, fontSize: 12 }}
        />
        <YAxis
          domain={[0, 100]}
          ticks={[0, 20, 40, 60, 80, 100]}
          tickLine={false}
          axisLine={false}
          tick={{ fill: AXIS_TEXT_COLOR, fontSize: 12 }}
        />
        <Tooltip
          content={<TooltipContent />}
          cursor={{ fill: "var(--color-background)" }}
        />
        <Bar
          dataKey="utilizacao"
          fill={CHART_BLUE}
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
          isAnimationActive={false}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
