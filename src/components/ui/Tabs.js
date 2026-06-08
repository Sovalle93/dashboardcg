// components/ui/Tabs.jsx
"use client";
import { useState } from "react";

const categorias = {
  general: "📊 General",
  ventas: "💰 Ventas",
  sucursales: "🏢 Sucursales",
  crecimiento: "📈 Crecimiento",
  tickets: "🎫 Tickets",
  avanzado: "⚙️ Avanzado"
};

export default function Tabs({ activo, onChange }) {
  return (
    <div style={{
      display: "flex",
      gap: 4,
      background: "#fff",
      borderBottom: "1px solid #e8e8e8",
      padding: "0 24px",
      overflowX: "auto",
      scrollbarWidth: "thin"
    }}>
      {Object.entries(categorias).map(([key, label]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          style={{
            padding: "12px 20px",
            fontSize: 13,
            fontWeight: activo === key ? 700 : 500,
            color: activo === key ? "#002b54" : "#666",
            borderBottom: activo === key ? "2px solid #002b54" : "2px solid transparent",
            background: "transparent",
            cursor: "pointer",
            transition: "all 0.2s",
            whiteSpace: "nowrap"
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}