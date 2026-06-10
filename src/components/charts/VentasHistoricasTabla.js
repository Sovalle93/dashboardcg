"use client";
import { TrendingUp, TrendingDown } from "lucide-react";

const TH = ({ children, right }) => (
  <th style={{
    padding: "9px 14px",
    textAlign: right ? "right" : "left",
    color: "#002b54",
    fontWeight: 700,
    fontSize: 12,
    whiteSpace: "nowrap",
    borderBottom: "2px solid #002b54",
    background: "#f5f7fb",
  }}>
    {children}
  </th>
);

const TD = ({ children, right, muted }) => (
  <td style={{
    padding: "8px 14px",
    textAlign: right ? "right" : "left",
    color: muted ? "#999" : "#222",
    fontSize: 13,
    whiteSpace: "nowrap",
  }}>
    {children}
  </td>
);

function GrowthCell({ value, formatFn }) {
  if (value === null || value === undefined) {
    return <span style={{ color: "#bbb" }}>—</span>;
  }
  const color = value > 0 ? "#2ecc71" : value < 0 ? "#e74c3c" : "#999";
  const Icon = value > 0 ? TrendingUp : value < 0 ? TrendingDown : null;
  return (
    <div style={{ color, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
      {Icon && <Icon size={12} />}
      {formatFn(value)}
    </div>
  );
}

export default function VentasHistoricasTabla({ datos, formatCLP, selectedMonths }) {
  if (!datos?.anios || datos.anios.length === 0 || !datos.data) return null;

  const { anios, data } = datos;
  const hasComparison = anios.length >= 2;
  const anioActual = anios[anios.length - 1];
  const anioAnterior = hasComparison ? anios[anios.length - 2] : null;

  const filas = data.filter((row) =>
    !selectedMonths || selectedMonths.length === 0 || selectedMonths.includes(row.mes)
  );

  if (filas.length === 0) return null;

  // Totals
  let totalActual = 0;
  let totalAnterior = 0;

  filas.forEach((row) => {
    totalActual += row[anioActual] || 0;
    if (anioAnterior) totalAnterior += row[anioAnterior] || 0;
  });

  const totalDiff = totalActual - totalAnterior;
  const totalPct = totalAnterior > 0 ? (totalDiff / totalAnterior) * 100 : null;

  const rowStyle = (i) => ({
    background: i % 2 === 0 ? "#fff" : "#f8f9fc",
    borderBottom: "1px solid #f0f0f0",
    transition: "background 0.1s",
  });

  return (
    <div style={{ marginTop: 28, borderTop: "1px solid #f0f0f0", paddingTop: 20 }}>
      <p style={{
        fontSize: 11,
        fontWeight: 700,
        color: "#002b54",
        textTransform: "uppercase",
        letterSpacing: "0.09em",
        marginBottom: 12,
      }}>
        {hasComparison
          ? `Comparativa mensual — ${anioActual} vs ${anioAnterior}`
          : `Detalle mensual — ${anioActual}`}
      </p>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              <TH>Mes</TH>
              <TH right>{anioActual}</TH>
              {hasComparison && <TH right>{anioAnterior}</TH>}
              {hasComparison && <TH right>Diferencia</TH>}
              {hasComparison && <TH right>% Crec.</TH>}
            </tr>
          </thead>

          <tbody>
            {filas.map((row, i) => {
              const actual = row[anioActual] || 0;
              const anterior = anioAnterior ? (row[anioAnterior] || 0) : null;
              const diff = anterior !== null ? actual - anterior : null;
              const pct = anterior > 0 ? (diff / anterior) * 100 : null;

              return (
                <tr key={row.mes} style={rowStyle(i)}>
                  <TD>
                    <span style={{ fontWeight: 600, color: "#333" }}>{row.mes}</span>
                  </TD>
                  <TD right>{formatCLP(actual)}</TD>
                  {hasComparison && <TD right muted>{formatCLP(anterior)}</TD>}
                  {hasComparison && (
                    <td style={{ padding: "8px 14px", textAlign: "right", whiteSpace: "nowrap" }}>
                      <GrowthCell value={diff} formatFn={(v) => formatCLP(Math.abs(v))} />
                    </td>
                  )}
                  {hasComparison && (
                    <td style={{ padding: "8px 14px", textAlign: "right", whiteSpace: "nowrap" }}>
                      <GrowthCell value={pct} formatFn={(v) => `${Math.abs(v).toFixed(1)}%`} />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>

          <tfoot>
            <tr style={{ background: "#edf0f7", borderTop: "2px solid #002b54" }}>
              <td style={{ padding: "10px 14px", fontWeight: 700, color: "#002b54", fontSize: 13 }}>
                Total
              </td>
              <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: "#111", fontSize: 13 }}>
                {formatCLP(totalActual)}
              </td>
              {hasComparison && (
                <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: "#888", fontSize: 13 }}>
                  {formatCLP(totalAnterior)}
                </td>
              )}
              {hasComparison && (
                <td style={{ padding: "10px 14px", textAlign: "right" }}>
                  <GrowthCell value={totalDiff} formatFn={(v) => formatCLP(Math.abs(v))} />
                </td>
              )}
              {hasComparison && (
                <td style={{ padding: "10px 14px", textAlign: "right" }}>
                  <GrowthCell value={totalPct} formatFn={(v) => `${Math.abs(v).toFixed(1)}%`} />
                </td>
              )}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
