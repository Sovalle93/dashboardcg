"use client";
import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList, Cell,
  PieChart, Pie, Legend,
} from "recharts";
import { CHART_COLORS, CHART_TOOLTIP_STYLE, AXIS_TICK_X, AXIS_TICK_Y, formatMillionsDecimal } from "@/lib/constants";

export default function GraficoFormaPago({ datos, formatCLP, theme }) {
  const [tipoGrafico, setTipoGrafico] = useState('bar');
  if (!datos || datos.length === 0) return null;

  const totalMonto = datos.reduce((s, d) => s + d.total, 0);
  const colors = theme?.palette ?? CHART_COLORS;
  const activeBg = theme?.accent ?? '#002b54';
  const activeText = theme?.textOnAccent ?? '#fff';

  return (
    <div className="card">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Distribución forma de pago
        </p>
        <div style={{ display: "flex", gap: 4 }}>
          {[{ v: 'bar', label: 'Barras' }, { v: 'pie', label: 'Torta' }].map(opt => (
            <button
              key={opt.v}
              onClick={() => setTipoGrafico(opt.v)}
              style={{
                padding: '4px 10px',
                fontSize: 11,
                fontWeight: tipoGrafico === opt.v ? 600 : 400,
                background: tipoGrafico === opt.v ? activeBg : '#f5f5f5',
                color: tipoGrafico === opt.v ? activeText : '#666',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {tipoGrafico === 'bar' ? (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={datos} margin={{ top: 24, right: 24, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="formaPago" tick={AXIS_TICK_X} />
            <YAxis tick={AXIS_TICK_Y} tickFormatter={formatMillionsDecimal} />
            <Tooltip
              formatter={(v, name) => [name === 'total' ? formatCLP(v) : v.toLocaleString(), name === 'total' ? 'Monto' : 'Pedidos']}
              contentStyle={CHART_TOOLTIP_STYLE}
            />
            <Bar dataKey="total" radius={[6, 6, 0, 0]} name="total">
              {datos.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
              <LabelList
                dataKey="total"
                position="top"
                formatter={formatMillionsDecimal}
                style={{ fontSize: 12, fill: "#333", fontFamily: "inherit", fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Tooltip
              formatter={(v) => [formatCLP(v), "Monto"]}
              contentStyle={CHART_TOOLTIP_STYLE}
            />
            <Pie
              data={datos}
              dataKey="total"
              nameKey="formaPago"
              cx="50%"
              cy="50%"
              outerRadius={90}
            >
              {datos.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 16 }}>
        {datos.map((d, i) => {
          const pct = ((d.total / totalMonto) * 100).toFixed(1);
          return (
            <div key={d.formaPago} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: colors[i % colors.length], flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "#444", fontWeight: 600 }}>{d.formaPago}</span>
              <span style={{ fontSize: 12, color: "#888" }}>{pct}% · {d.cantidad.toLocaleString()} pedidos</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
