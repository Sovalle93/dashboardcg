"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const MESES = { "01":"Ene","02":"Feb","03":"Mar","04":"Abr","05":"May","06":"Jun","07":"Jul","08":"Ago","09":"Sep","10":"Oct","11":"Nov","12":"Dic" };

export default function GraficoMensual({ datos, formatCLP }) {
  const chart = datos.map((d) => ({ ...d, mesLabel: MESES[d.mes.split("-")[1]] || d.mes }));
  return (
    <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 16, padding: "28px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 24 }}>Evolución de ventas</p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chart} margin={{ top: 10, right: 16, left: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#002b54" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#002b54" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="mesLabel" tick={{ fill: "#888", fontSize: 11, fontFamily: "inherit" }} />
          <YAxis tick={{ fill: "#888", fontSize: 10, fontFamily: "inherit" }} tickFormatter={(v) => `$${(v/1000000).toFixed(0)}M`} />
          <Tooltip formatter={(v) => [formatCLP(v), "Ventas"]} contentStyle={{ borderRadius: 10, fontSize: 13, border: "1px solid #e8e8e8", fontFamily: "inherit" }} />
          <Area type="monotone" dataKey="total" stroke="#002b54" strokeWidth={2.5} fill="url(#grad)" dot={{ fill: "#002b54", r: 4 }} activeDot={{ r: 6 }} name="Ventas" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}