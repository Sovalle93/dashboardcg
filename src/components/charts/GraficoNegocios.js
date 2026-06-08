"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from "recharts";

export default function GraficoNegocios({ datos, formatCLP }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 16, padding: "28px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 24 }}>Participación por negocio</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={datos} margin={{ top: 24, right: 24, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="negocio" tick={{ fill: "#888", fontSize: 12, fontFamily: "inherit" }} />
          <YAxis tick={{ fill: "#888", fontSize: 11, fontFamily: "inherit" }} tickFormatter={(v) => `$${(v/1000000).toFixed(1)}M`} />
          <Tooltip
            formatter={(v, n) => [formatCLP(v), "Ventas"]}
            contentStyle={{ borderRadius: 10, fontSize: 13, border: "1px solid #e8e8e8", fontFamily: "inherit" }}
          />
          <Bar dataKey="total" radius={[6, 6, 0, 0]}>
            {datos.map((_, i) => (
              <rect key={i} fill={i === 0 ? "#002b54" : "#4a90d9"} />
            ))}
            <LabelList
              dataKey="total"
              position="top"
              formatter={(v) => `$${(v/1000000).toFixed(1)}M`}
              style={{ fontSize: 12, fill: "#333", fontFamily: "inherit", fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 16 }}>
        {datos.map((d, i) => {
          const total = datos.reduce((s, x) => s + x.total, 0);
          const pct = ((d.total / total) * 100).toFixed(1);
          return (
            <div key={d.negocio} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: i === 0 ? "#002b54" : "#4a90d9" }} />
              <span style={{ fontSize: 13, color: "#444", fontWeight: 600 }}>{d.negocio}</span>
              <span style={{ fontSize: 13, color: "#888" }}>{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}