"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import FiltroHeader from "@/components/ui/FiltroHeader";
import { CHART_COLORS, CHART_TOOLTIP_STYLE, AXIS_TICK_X, AXIS_TICK_Y, formatMillions } from "@/lib/constants";

export default function VentasHistoricas({ datos, formatCLP }) {
  const { anios, data } = datos;

  if (!anios || anios.length === 0) return null;

  return (
    <div className="card" style={{ gridColumn: "1 / -1" }}>
      <FiltroHeader titulo="Ventas históricas — evolución anual" filtros={anios.map(String)} />
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 10, right: 24, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="mes" tick={AXIS_TICK_X} />
          <YAxis tick={AXIS_TICK_Y} tickFormatter={formatMillions} />
          <Tooltip formatter={(v) => formatCLP(v)} contentStyle={CHART_TOOLTIP_STYLE} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 16, fontFamily: "inherit" }} />
          {anios.map((a, i) => (
            <Line
              key={a}
              type="monotone"
              dataKey={a}
              stroke={CHART_COLORS[i % CHART_COLORS.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
