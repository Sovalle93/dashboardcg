"use client";

const COLORS = ["#002b54", "#1a5276", "#4a90d9", "#7ec8f4", "#b0d9f7"];

export default function GraficoFormaPago({ datos }) {
  const total = datos.reduce((s, d) => s + d.cantidad, 0);
  const totalMonto = datos.reduce((s, d) => s + d.total, 0);

  return (
    <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 16, padding: "28px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 24 }}>Forma de pago</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {datos.map((d, i) => {
          const pct = ((d.cantidad / total) * 100).toFixed(1);
          return (
            <div key={d.formaPago}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "#333", fontWeight: 500 }}>{d.formaPago}</span>
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#002b54" }}>{pct}%</span>
                  <span style={{ fontSize: 12, color: "#999", minWidth: 60, textAlign: "right" }}>{d.cantidad} pedidos</span>
                </div>
              </div>
              <div style={{ background: "#f0f4f8", borderRadius: 99, height: 8, overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: COLORS[i % COLORS.length], borderRadius: 99, transition: "width 0.6s ease" }} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "#999" }}>Total transacciones</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{total.toLocaleString("es-CL")}</span>
      </div>
    </div>
  );
}