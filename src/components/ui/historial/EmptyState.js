import { Archive } from "lucide-react";

export function EmptyState() {
  return (
    <div style={{ padding: "60px 20px", textAlign: "center", color: "#999" }}>
      <Archive size={48} opacity={0.3} />
      <p style={{ fontSize: 13, marginTop: 16, fontWeight: 500 }}>Aún no hay registros</p>
      <p style={{ fontSize: 11, marginTop: 4 }}>Sube archivos Excel para comenzar</p>
    </div>
  );
}