import { TrendingUp, ShoppingBag, CreditCard, MapPin } from "lucide-react";

export default function ResumenCards({ totalVentas, totalPedidos, ticketPromedio, sucursales, formatCLP }) {
  const cards = [
    { label: "Ventas totales", valor: formatCLP(totalVentas), Icon: TrendingUp, color: "#002b54" },
    { label: "Total pedidos", valor: totalPedidos.toLocaleString("es-CL"), Icon: ShoppingBag, color: "#1a5276" },
    { label: "Ticket promedio", valor: formatCLP(ticketPromedio), Icon: CreditCard, color: "#1f618d" },
    { label: "Sucursales activas", valor: sucursales, Icon: MapPin, color: "#2874a6" },
  ];
  return (
    <div className="grid-4">
      {cards.map((c) => (
        <div key={c.label} style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 16, padding: "24px 28px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: c.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <c.Icon size={18} color="#fff" />
          </div>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#111", lineHeight: 1.2 }}>{c.valor}</p>
          <p style={{ fontSize: 11, color: "#999", marginTop: 6, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{c.label}</p>
        </div>
      ))}
    </div>
  );
}