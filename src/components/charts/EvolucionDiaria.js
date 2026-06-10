"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import FiltroHeader from "@/components/ui/FiltroHeader";
import { CHART_TOOLTIP_STYLE, AXIS_TICK_X, AXIS_TICK_Y, formatMillionsDecimal } from "@/lib/constants";

export default function EvolucionDiaria({ datos, formatCLP, theme }) {
  const diasUnicos = datos.length;
  // Spread to avoid mutating the prop before sorting
  const mejorDia = [...datos].sort((a, b) => b.total - a.total)[0];
  const totalAcum = datos.reduce((s, d) => s + d.total, 0);
  const accent = theme?.accent ?? '#002b54';

  return (
    <div className="card" style={{ gridColumn: "1 / -1" }}>
      <FiltroHeader
        titulo="Evolución diaria — control operacional"
        filtros={[`${diasUnicos} día(s)`, "CLP"]}
      />
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={datos} margin={{ top: 10, right: 24, left: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="gradDia" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={accent} stopOpacity={0.12} />
              <stop offset="95%" stopColor={accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="dia" tick={AXIS_TICK_X} />
          <YAxis tick={AXIS_TICK_Y} tickFormatter={formatMillionsDecimal} />
          <Tooltip
            formatter={(v) => [formatCLP(v), "Ventas"]}
            contentStyle={CHART_TOOLTIP_STYLE}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke={accent}
            strokeWidth={2.5}
            fill="url(#gradDia)"
            dot={{ fill: accent, r: 4 }}
            activeDot={{ r: 6 }}
            name="Ventas"
          />
        </AreaChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", gap: 32, marginTop: 20, paddingTop: 16, borderTop: "1px solid #f0f0f0" }}>
        <div>
          <p style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em" }}>Mejor día</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#002b54", marginTop: 4 }}>
            {mejorDia?.dia} — {formatCLP(mejorDia?.total ?? 0)}
          </p>
        </div>
        <div>
          <p style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em" }}>Promedio diario</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#333", marginTop: 4 }}>
            {formatCLP(diasUnicos > 0 ? Math.round(totalAcum / diasUnicos) : 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
