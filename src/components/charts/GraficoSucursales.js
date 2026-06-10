"use client";
import FiltroHeader from "@/components/ui/FiltroHeader";

export default function GraficoSucursales({ datos, formatCLP, theme }) {
  const total = datos.reduce((s, d) => s + d.total, 0);

  return (
    <div className="card">
      <FiltroHeader titulo="Top sucursales" />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {datos.slice(0, 7).map((d, i) => {
          const pct = ((d.total / total) * 100).toFixed(1);
          return (
            <div key={d.sucursal}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: "#333", fontWeight: 500 }}>#{i + 1} {d.sucursal}</span>
                <div style={{ display: "flex", gap: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#002b54" }}>{pct}%</span>
                  <span style={{ fontSize: 12, color: "#999", minWidth: 90, textAlign: "right" }}>{formatCLP(d.total)}</span>
                </div>
              </div>
              <div style={{ background: "#f0f4f8", borderRadius: 99, height: 8, overflow: "hidden" }}>
                <div style={{
                  width: `${pct}%`,
                  height: "100%",
                  borderRadius: 99,
                  background: theme ? theme.palette[i % theme.palette.length] : `hsl(${210 + i * 8}, ${70 - i * 5}%, ${25 + i * 6}%)`,
                  transition: "width 0.6s ease"
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
