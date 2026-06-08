export default function SinDatos({ titulo, razon }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 16, padding: "28px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 0 }}>{titulo}</p>
      <div style={{ marginTop: 32, marginBottom: 32, textAlign: "center" }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: "#f8f8f8", border: "1.5px dashed #ddd", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <span style={{ fontSize: 22 }}>📊</span>
        </div>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#555", marginBottom: 6 }}>Datos insuficientes</p>
        <p style={{ fontSize: 12, color: "#aaa", lineHeight: 1.6, maxWidth: 260, margin: "0 auto" }}>{razon}</p>
      </div>
    </div>
  );
}