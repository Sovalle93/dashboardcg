"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from "recharts";
import FiltroHeader from "@/components/ui/FiltroHeader";

const COLORS = ["#002b54","#1a5276","#4a90d9","#7ec8f4","#b0d9f7"];

export default function TicketPromedio({ datosNegocio, datosTipo, formatCLP }) {
  return (
    <>
      <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 16, padding: "28px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <FiltroHeader titulo="Ticket promedio por área de negocio" />
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={datosNegocio} margin={{ top: 28, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="negocio" tick={{ fill: "#888", fontSize: 12, fontFamily: "inherit" }} />
            <YAxis tick={{ fill: "#888", fontSize: 10, fontFamily: "inherit" }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
            <Tooltip formatter={(v) => [formatCLP(v), "Ticket promedio"]} contentStyle={{ borderRadius: 10, fontSize: 13, border: "1px solid #e8e8e8", fontFamily: "inherit" }} />
            <Bar dataKey="promedio" radius={[6,6,0,0]} fill="#002b54" name="Ticket promedio">
              <LabelList dataKey="promedio" position="top" formatter={(v) => `$${(v/1000).toFixed(0)}K`} style={{ fontSize: 12, fill: "#333", fontFamily: "inherit", fontWeight: 600 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 16, padding: "28px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <FiltroHeader titulo="Ticket promedio por tipo de producto" />
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
          {datosTipo.map((d, i) => (
            <div key={d.tipo}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "#333", fontWeight: 500 }}>{d.tipo}</span>
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#002b54" }}>{formatCLP(d.promedio)}</span>
                  <span style={{ fontSize: 12, color: "#999" }}>{d.cantidad} pedidos</span>
                </div>
              </div>
              <div style={{ background: "#f0f4f8", borderRadius: 99, height: 7, overflow: "hidden" }}>
                <div style={{ width: `${Math.min((d.promedio / datosTipo[0].promedio) * 100, 100)}%`, height: "100%", borderRadius: 99, background: COLORS[i % COLORS.length] }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}