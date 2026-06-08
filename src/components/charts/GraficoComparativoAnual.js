"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";

export default function GraficoComparativoAnual({ datos, formatCLP }) {
  const porAnio = {};
  datos.forEach(({ mes, total }) => {
    const [anio, m] = mes.split("-");
    if (!porAnio[anio]) porAnio[anio] = {};
    porAnio[anio][m] = total;
  });
  const anios = Object.keys(porAnio).sort();
  const meses = ["01","02","03","04","05","06","07","08","09","10","11","12"];
  const nombMes = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  const chartData = meses.map((m, i) => {
    const row = { mes: nombMes[i] };
    anios.forEach((a) => { row[a] = porAnio[a]?.[m] || 0; });
    return row;
  });
  const COLORS = ["#002b54", "#4a90d9", "#7ec8f4", "#b0d9f7"];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">Ventas anuales comparativo</h2>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="mes" tick={{ fill: "#666", fontSize: 11 }} />
          <YAxis tick={{ fill: "#666", fontSize: 10 }} tickFormatter={(v) => `$${(v/1000000).toFixed(0)}M`} />
          <Tooltip formatter={(v) => formatCLP(v)} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {anios.map((a, i) => <Bar key={a} dataKey={a} fill={COLORS[i % COLORS.length]} radius={[3,3,0,0]} />)}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}