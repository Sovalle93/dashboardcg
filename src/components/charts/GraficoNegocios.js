"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList, Cell } from "recharts";
import FiltroHeader from "@/components/ui/FiltroHeader";
import { CHART_COLORS, CHART_TOOLTIP_STYLE, AXIS_TICK_X, AXIS_TICK_Y, formatMillionsDecimal } from "@/lib/constants";

export default function GraficoNegocios({ datos, formatCLP }) {
  const total = datos.reduce((s, x) => s + x.total, 0);

  return (
    <div className="card">
      <FiltroHeader titulo="Participación por negocio" />
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={datos} margin={{ top: 24, right: 24, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="negocio" tick={AXIS_TICK_X} />
          <YAxis tick={AXIS_TICK_Y} tickFormatter={formatMillionsDecimal} />
          <Tooltip
            formatter={(v) => [formatCLP(v), "Ventas"]}
            contentStyle={CHART_TOOLTIP_STYLE}
          />
          <Bar dataKey="total" radius={[6, 6, 0, 0]}>
            {datos.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
            <LabelList
              dataKey="total"
              position="top"
              formatter={formatMillionsDecimal}
              style={{ fontSize: 12, fill: "#333", fontFamily: "inherit", fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 16 }}>
        {datos.map((d, i) => {
          const pct = ((d.total / total) * 100).toFixed(1);
          return (
            <div key={d.negocio} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: CHART_COLORS[i % CHART_COLORS.length] }} />
              <span style={{ fontSize: 13, color: "#444", fontWeight: 600 }}>{d.negocio}</span>
              <span style={{ fontSize: 13, color: "#888" }}>{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
