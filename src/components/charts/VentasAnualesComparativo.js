"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import FiltroHeader from "@/components/ui/FiltroHeader";
import { CHART_TOOLTIP_STYLE, AXIS_TICK_X, AXIS_TICK_Y, formatMillions } from "@/lib/constants";

export default function VentasAnualesComparativo({ datos, formatCLP }) {
  const { anios, data } = datos;

  if (!anios || anios.length < 2) {
    return (
      <div className="card">
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
    <div className="card">
      <FiltroHeader titulo="Ventas anuales vs año anterior" filtros={[anterior, actual, "Mensual", "CLP"]} />
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 20, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="mes" tick={AXIS_TICK_X} />
          <YAxis tick={AXIS_TICK_Y} tickFormatter={formatMillions} />
          <Tooltip formatter={(v) => formatCLP(v)} contentStyle={CHART_TOOLTIP_STYLE} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12, fontFamily: "inherit" }} />
          <Bar dataKey={anterior} fill="#b0d9f7" radius={[4, 4, 0, 0]} />
          <Bar dataKey={actual} fill="#002b54" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
