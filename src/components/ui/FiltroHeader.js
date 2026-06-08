export default function FiltroHeader({ titulo, filtros }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em" }}>{titulo}</p>
      {filtros && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {filtros.map((f) => (
            <span key={f} style={{ fontSize: 11, fontWeight: 600, color: "#002b54", background: "#e8f0f8", borderRadius: 6, padding: "3px 10px" }}>{f}</span>
          ))}
        </div>
      )}
    </div>
  );
}