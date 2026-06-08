"use client";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import FiltroHeader from "@/components/ui/FiltroHeader";

const MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const COLORS = ["#002b54","#1a5276","#4a90d9","#7ec8f4","#b0d9f7","#034078","#1282a2"];

export default function VentasHistoricas({ datos, formatCLP }) {
  const { anios, data } = datos;
  const [localesFiltro, setLocalesFiltro] = useState("todos");

  if (!anios || anios.length === 0) return null;

  return (
    <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 16, padding: "28px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", gridColumn: "1 / -1" }}>
      <FiltroHeader titulo="Ventas históricas — evolución anual" filtros={anios.map((a) => `${a}`)} />
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 10, right: 24, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="mes" tick={{ fill: "#888", fontSize: 12, fontFamily: "inherit" }} />
          <YAxis tick={{ fill: "#888", fontSize: 10, fontFamily: "inherit" }} tickFormatter={(v) => `$${(v/1000000).toFixed(0)}M`} />
          <Tooltip formatter={(v) => formatCLP(v)} contentStyle={{ borderRadius: 10, fontSize: 13, border: "1px solid #e8e8e8", fontFamily: "inherit" }} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 16, fontFamily: "inherit" }} />
          {anios.map((a, i) => (
            <Line key={a} type="monotone" dataKey={a} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}