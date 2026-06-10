"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList, Cell } from "recharts";
import FiltroHeader from "@/components/ui/FiltroHeader";
import { CHART_COLORS, CHART_TOOLTIP_STYLE, AXIS_TICK_X, AXIS_TICK_Y } from "@/lib/constants";

export default function GraficoCantidadTipo({ datos, formatCLP, theme }) {
  if (!datos || datos.length === 0) return null;

  const total = datos.reduce((s, d) => s + d.cantidad, 0);
  const colors = theme?.palette ?? CHART_COLORS;

  return (
    <div className="card">
      <FiltroHeader
        titulo="Pedidos por tipo de producto"
        filtros={[`${total.toLocaleString()} pedidos`]}
      />
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={datos} margin={{ top: 28, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="tipo" tick={AXIS_TICK_X} />
          <YAxis tick={AXIS_TICK_Y} tickFormatter={(v) => v.toLocaleString()} />
          <Tooltip
            formatter={(v, name, props) => [
              `${v.toLocaleString()} pedidos (${((v / total) * 100).toFixed(1)}%)`,
              "Cantidad",
            ]}
            contentStyle={CHART_TOOLTIP_STYLE}
          />
          <Bar dataKey="cantidad" radius={[6, 6, 0, 0]} name="Pedidos">
            {datos.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
            <LabelList
              dataKey="cantidad"
              position="top"
              formatter={(v) => v.toLocaleString()}
              style={{ fontSize: 12, fill: "#333", fontFamily: "inherit", fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        marginTop: 16,
        paddingTop: 14,
        borderTop: "1px solid #f0f0f0"
      }}>
        {datos.map((d, i) => {
          const pct = ((d.cantidad / total) * 100).toFixed(1);
          return (
            <div key={d.tipo} style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 80 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: colors[i % colors.length], flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: "#666", fontWeight: 600 }}>{d.tipo}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#111", paddingLeft: 16 }}>
                {d.cantidad.toLocaleString()}
                <span style={{ fontSize: 11, fontWeight: 400, color: "#999", marginLeft: 4 }}>{pct}%</span>
              </span>
              <span style={{ fontSize: 11, color: "#bbb", paddingLeft: 16 }}>{formatCLP(d.total)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
