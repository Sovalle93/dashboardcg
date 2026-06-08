// components/ui/historial/HistorialButton.jsx
"use client";
import { History, ChevronDown } from "lucide-react";

export function HistorialButton({ onClick, totalRegistros, abierto }) {
  return (
    <button
      className="historial-button-ref"  // ← Clase para referencia
      onClick={onClick}
      style={{
        gap: 8,
        padding: "10px 20px",
        fontSize: 13,
        background: abierto ? "#f5f5f5" : "#fff",
        border: "1px solid #d0d0d0",
        borderRadius: 10,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        transition: "all 0.2s"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#f5f5f5";
        e.currentTarget.style.borderColor = "#002b54";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = abierto ? "#f5f5f5" : "#fff";
        e.currentTarget.style.borderColor = "#d0d0d0";
      }}
    >
      <History size={16} />
      Historial ({totalRegistros})
      <ChevronDown size={14} style={{ opacity: 0.6, transform: abierto ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
    </button>
  );
}