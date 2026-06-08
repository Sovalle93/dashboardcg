"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import FiltroHeader from "@/components/ui/FiltroHeader";

export default function EvolucionDiaria({ datos, formatCLP }) {
  const diasUnicos = [...new Set(datos.map((d) => d.dia))];
  return (
    <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 16, padding: "28px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", gridColumn: "1 / -1" }}>
      <FiltroHeader titulo="Evolución diaria — control operacional" filtros={[`${diasUnicos.length} día(s)`, "CLP"]} />
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={datos} margin={{ top: 10, right: 24, left: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="gradDia" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#002b54" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#002b54" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="dia" tick={{ fill: "#888", fontSize: 11, fontFamily: "inherit" }} />
          <YAxis tick={{ fill: "#888", fontSize: 10, fontFamily: "inherit" }} tickFormatter={(v) => `$${(v/1000000).toFixed(1)}M`} />
          <Tooltip formatter={(v) => [formatCLP(v), "Ventas"]} contentStyle={{ borderRadius: 10, fontSize: 13, border: "1px solid #e8e8e8", fontFamily: "inherit" }} />
          <Area type="monotone" dataKey="total" stroke="#002b54" strokeWidth={2.5} fill="url(#gradDia)" dot={{ fill: "#002b54", r: 4 }} activeDot={{ r: 6 }} name="Ventas" />
        </AreaChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", gap: 32, marginTop: 20, paddingTop: 16, borderTop: "1px solid #f0f0f0" }}>
        <div>
          <p style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em" }}>Mejor día</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#002b54", marginTop: 4 }}>
            {datos.sort((a,b) => b.total - a.total)[0]?.dia} — {formatCLP(Math.max(...datos.map(d => d.total)))}
          </p>
        </div>
        <div>
          <p style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em" }}>Promedio diario</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#333", marginTop: 4 }}>
            {formatCLP(Math.round(datos.reduce((s,d) => s+d.total, 0) / datos.length))}
          </p>
        </div>
      </div>
    </div>
  );
}