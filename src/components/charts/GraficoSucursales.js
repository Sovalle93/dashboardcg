"use client";
import { formatCLP as fmt } from "@/lib/parseExcel";

export default function GraficoSucursales({ datos, formatCLP }) {
  const total = datos.reduce((s, d) => s + d.total, 0);
  return (
    <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 16, padding: "28px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 24 }}>Top sucursales</p>
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
                <div style={{ width: `${pct}%`, height: "100%", borderRadius: 99, background: `hsl(${210 + i * 8}, ${70 - i * 5}%, ${25 + i * 6}%)`, transition: "width 0.6s ease" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}