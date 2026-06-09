"use client";
import FiltroHeader from "@/components/ui/FiltroHeader";

export default function CrecimientoVsAnterior({ datos: { datos, anioActual, anioAnterior }, formatCLP }) {
  if (!anioAnterior) {
    return (
      <div className="card">
        <FiltroHeader titulo="Crecimiento vs año anterior por local" />
        <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa", fontSize: 13 }}>
          Necesitás datos de al menos 2 años para calcular crecimiento
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ gridColumn: "1 / -1" }}>
      <FiltroHeader titulo="Crecimiento vs año anterior por local" filtros={[anioAnterior, "→", anioActual]} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
        {datos.map((d) => {
          const positivo = d.pct >= 0;
          return (
            <div key={d.sucursal} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 12, color: "#333", width: 200, flexShrink: 0 }}>{d.sucursal}</span>
              <div style={{ flex: 1, background: "#f0f4f8", borderRadius: 99, height: 10, overflow: "hidden" }}>
                <div style={{
                  width: `${Math.min(Math.abs(d.pct ?? 0), 100)}%`,
                  height: "100%",
                  borderRadius: 99,
                  background: positivo ? "#002b54" : "#e53e3e",
                  transition: "width 0.6s ease"
                }} />
              </div>
              <span style={{
                fontSize: 13,
                fontWeight: 700,
                color: positivo ? "#002b54" : "#e53e3e",
                minWidth: 64,
                textAlign: "right"
              }}>
                {d.pct !== null ? `${positivo ? "+" : ""}${d.pct.toFixed(1)}%` : "—"}
              </span>
              <span style={{ fontSize: 11, color: "#999", minWidth: 100, textAlign: "right" }}>
                {formatCLP(d.actual)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
