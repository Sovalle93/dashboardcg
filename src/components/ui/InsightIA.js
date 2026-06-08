"use client";
import { useState } from "react";
import { Sparkles } from "lucide-react";

export default function InsightIA({ totalVentas, totalPedidos, datosMes, datosSucursal }) {
  const [insight, setInsight] = useState("");
  const [cargando, setCargando] = useState(false);

  async function generarInsight() {
    setCargando(true);
    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalVentas, totalPedidos, datosMes, datosSucursal }),
      });
      const data = await res.json();
      setInsight(data.insight);
    } catch {
      setInsight("Error al generar el análisis.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 16, padding: "28px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: insight ? 20 : 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "#002b54", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={16} color="#fff" />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>Análisis con Inteligencia Artificial</p>
            <p style={{ fontSize: 11, color: "#999", marginTop: 1 }}>Generado automáticamente a partir de tus datos</p>
          </div>
        </div>
        <button className="btn-primary" onClick={generarInsight} disabled={cargando}>
          <Sparkles size={14} />
          {cargando ? "Analizando..." : "Generar análisis"}
        </button>
      </div>
      {insight && (
        <p style={{ fontSize: 14, color: "#333", lineHeight: 1.75, paddingTop: 20, borderTop: "1px solid #f0f0f0" }}>
          {insight}
        </p>
      )}
      {!insight && (
        <p style={{ fontSize: 13, color: "#bbb", marginTop: 16 }}>
          Presioná el botón para obtener un análisis inteligente de tus ventas.
        </p>
      )}
    </div>
  );
}