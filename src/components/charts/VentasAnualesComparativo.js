"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, LabelList } from "recharts";
import FiltroHeader from "@/components/ui/FiltroHeader";

const MESES = { "01":"Ene","02":"Feb","03":"Mar","04":"Abr","05":"May","06":"Jun","07":"Jul","08":"Ago","09":"Sep","10":"Oct","11":"Nov","12":"Dic" };

export default function VentasAnualesComparativo({ datos, formatCLP }) {
  const { anios, data } = datos;
  if (!anios || anios.length < 2) {
    return (
      <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 16, padding: "28px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <FiltroHeader titulo="Ventas anuales vs año anterior" filtros={["Anual", "CLP"]} />
        <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa", fontSize: 13 }}>
          Cargá archivos de al menos 2 años para ver la comparación
        </div>
      </div>
    );
  }
  const actual = anios[anios.length - 1];
  const anterior = anios[anios.length - 2];

  return (
    <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 16, padding: "28px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <FiltroHeader titulo="Ventas anuales vs año anterior" filtros={[anterior, actual, "Mensual", "CLP"]} />
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 20, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="mes" tick={{ fill: "#888", fontSize: 11, fontFamily: "inherit" }} />
          <YAxis tick={{ fill: "#888", fontSize: 10, fontFamily: "inherit" }} tickFormatter={(v) => `$${(v/1000000).toFixed(0)}M`} />
          <Tooltip formatter={(v) => formatCLP(v)} contentStyle={{ borderRadius: 10, fontSize: 13, border: "1px solid #e8e8e8", fontFamily: "inherit" }} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12, fontFamily: "inherit" }} />
          <Bar dataKey={anterior} fill="#b0d9f7" radius={[4,4,0,0]} />
          <Bar dataKey={actual} fill="#002b54" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}