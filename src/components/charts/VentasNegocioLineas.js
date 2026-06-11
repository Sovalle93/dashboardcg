"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import FiltroHeader from "@/components/ui/FiltroHeader";
import { CHART_TOOLTIP_STYLE, AXIS_TICK_X, AXIS_TICK_Y, formatMillions } from "@/lib/constants";

// Fixed brand colors for negocio lines — dark gold for Trampoline Park (legible on white), teal for Cerogrado.
const NEGOCIO_LINE_COLORS = {
  'Trampoline Park': '#c49800',
  'Cerogrado': '#00acc9',
};
const TOTAL_COLOR = '#002b54';

const MONTH_SHORT = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const formatMesLabel = (mes) => {
  const [y, m] = mes.split('-');
  return `${MONTH_SHORT[parseInt(m, 10) - 1]} ${String(y).slice(2)}`;
};

export default function VentasNegocioLineas({ datos, formatCLP }) {
  const { negocios, data } = datos;
  if (!negocios || negocios.length < 2 || !data?.length) return null;

  return (
    <div className="card" style={{ gridColumn: "1 / -1" }}>
      <FiltroHeader
        titulo="Evolución por negocio — comparación mensual"
        filtros={[...negocios, 'Total acumulado']}
      />
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 10, right: 24, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="mes" tick={AXIS_TICK_X} tickFormatter={formatMesLabel} />
          <YAxis tick={AXIS_TICK_Y} tickFormatter={formatMillions} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const byKey = {};
              payload.forEach(p => { byKey[p.dataKey] = p; });
              return (
                <div style={{ ...CHART_TOOLTIP_STYLE, background: '#fff', padding: '10px 14px' }}>
                  <p style={{ fontWeight: 700, marginBottom: 6, fontSize: 13, color: '#111' }}>
                    {formatMesLabel(label)}
                  </p>
                  {[...negocios, 'total'].map(key => {
                    const item = byKey[key];
                    if (!item) return null;
                    return (
                      <p key={key} style={{ color: item.stroke, fontSize: 12, margin: '2px 0' }}>
                        {item.name ?? key} : {formatCLP(item.value)}
                      </p>
                    );
                  })}
                </div>
              );
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 16, fontFamily: "inherit" }} />
          {negocios.map(negocio => (
            <Line
              key={negocio}
              type="monotone"
              dataKey={negocio}
              stroke={NEGOCIO_LINE_COLORS[negocio] ?? '#4a90d9'}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
            />
          ))}
          <Line
            type="monotone"
            dataKey="total"
            name="Total"
            stroke={TOTAL_COLOR}
            strokeWidth={2}
            strokeDasharray="6 3"
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
