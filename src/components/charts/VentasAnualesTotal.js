"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList, Cell } from "recharts";
import FiltroHeader from "@/components/ui/FiltroHeader";
import { CHART_COLORS, CHART_TOOLTIP_STYLE, AXIS_TICK_X, AXIS_TICK_Y, formatMillions } from "@/lib/constants";

export default function VentasAnualesTotal({ datos, formatCLP, theme }) {
  if (!datos || datos.length === 0) return null;

  const total = datos.reduce((s, d) => s + d.total, 0);
  const colors = theme?.palette ?? CHART_COLORS;

  return (
    <div className="card" style={{ gridColumn: "1 / -1" }}>
      <FiltroHeader
        titulo="Ventas totales por año"
        filtros={[`${datos.length} año(s)`, "CLP"]}
      />
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={datos} margin={{ top: 28, right: 24, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="anio" tick={AXIS_TICK_X} />
          <YAxis tick={AXIS_TICK_Y} tickFormatter={formatMillions} />
          <Tooltip
            formatter={(v) => [formatCLP(v), "Ventas"]}
            contentStyle={CHART_TOOLTIP_STYLE}
          />
          <Bar dataKey="total" radius={[6, 6, 0, 0]} name="Ventas">
            {datos.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
            <LabelList
              dataKey="total"
              position="top"
              formatter={formatMillions}
              style={{ fontSize: 12, fill: "#333", fontFamily: "inherit", fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", gap: 32, marginTop: 20, paddingTop: 16, borderTop: "1px solid #f0f0f0" }}>
        {datos.map((d, i) => (
          <div key={d.anio}>
            <p style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em" }}>{d.anio}</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#111", marginTop: 4 }}>
              {formatCLP(d.total)}
            </p>
            <p style={{ fontSize: 11, color: "#bbb", marginTop: 2 }}>{d.cantidad.toLocaleString()} pedidos</p>
          </div>
        ))}
      </div>
    </div>
  );
}
