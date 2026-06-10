"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from "recharts";
import FiltroHeader from "@/components/ui/FiltroHeader";
import { CHART_COLORS, CHART_TOOLTIP_STYLE, AXIS_TICK_X, AXIS_TICK_Y, formatThousands } from "@/lib/constants";

export default function TicketPromedio({ datosNegocio, datosTipo, formatCLP, theme }) {
  const colors = theme?.palette ?? CHART_COLORS;
  return (
    <>
      <div className="card">
        <FiltroHeader titulo="Ticket promedio por área de negocio" />
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={datosNegocio} margin={{ top: 28, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="negocio" tick={AXIS_TICK_X} />
            <YAxis tick={AXIS_TICK_Y} tickFormatter={formatThousands} />
            <Tooltip
              formatter={(v) => [formatCLP(v), "Ticket promedio"]}
              contentStyle={CHART_TOOLTIP_STYLE}
            />
            <Bar dataKey="promedio" radius={[6, 6, 0, 0]} fill={theme?.accent ?? '#002b54'} name="Ticket promedio">
              <LabelList
                dataKey="promedio"
                position="top"
                formatter={formatThousands}
                style={{ fontSize: 12, fill: "#333", fontFamily: "inherit", fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <FiltroHeader titulo="Ticket promedio por tipo de producto" />
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
          {datosTipo.map((d, i) => (
            <div key={d.tipo}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: colors[i % colors.length],
                    flexShrink: 0
                  }} />
                  <span style={{ fontSize: 13, color: "#333", fontWeight: 500 }}>{d.tipo}</span>
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#002b54" }}>{formatCLP(d.promedio)}</span>
                  <span style={{ fontSize: 12, color: "#999" }}>{d.cantidad} pedidos</span>
                </div>
              </div>
              <div style={{ background: "#f0f4f8", borderRadius: 99, height: 7, overflow: "hidden" }}>
                <div style={{
                  width: `${Math.min((d.promedio / datosTipo[0].promedio) * 100, 100)}%`,
                  height: "100%",
                  borderRadius: 99,
                  background: colors[i % colors.length]
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
