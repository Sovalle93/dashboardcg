export function ComparacionPanel({ estadisticas }) {
  if (!estadisticas) return null;
  
  return (
    <div style={{ padding: "16px 20px", background: "#e8f4f8", borderBottom: "1px solid #cde5ed" }}>
      <h4 style={{ fontSize: 13, fontWeight: 700, color: "#002b54", marginBottom: 12 }}>
        📊 Comparación de períodos seleccionados:
      </h4>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {estadisticas.map((est, idx) => (
          <div key={idx} style={{ flex: 1, minWidth: 150, background: "#fff", padding: 12, borderRadius: 8 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#002b54", marginBottom: 8, wordBreak: "break-word" }}>{est.nombre}</p>
            <p style={{ fontSize: 12, margin: 4 }}>💰 ${est.ventas.toLocaleString()}</p>
            <p style={{ fontSize: 12, margin: 4 }}>📦 {est.pedidos} pedidos</p>
            <p style={{ fontSize: 12, margin: 4 }}>🎫 ${est.ticket.toFixed(0)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}