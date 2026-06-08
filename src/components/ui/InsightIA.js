"use client";
import { useState } from "react";
import { Sparkles, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

export default function InsightIA({ totalVentas, totalPedidos, datosMes, datosSucursal }) {
  const [insight, setInsight] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [metadata, setMetadata] = useState(null);

  async function generarInsight() {
    setCargando(true);
    setError("");
    setInsight("");
    setMetadata(null);
    
    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          totalVentas, 
          totalPedidos, 
          datosMes, 
          datosSucursal 
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error generando análisis");
      }
      
      setInsight(data.insight);
      setMetadata(data.metadata);
      
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
      setInsight("");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div style={{ 
      background: "#fff", 
      border: "1px solid #e8e8e8", 
      borderRadius: 16, 
      padding: "28px", 
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)" 
    }}>
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between", 
        marginBottom: insight || error ? 20 : 0,
        flexWrap: "wrap",
        gap: 16
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ 
            width: 34, 
            height: 34, 
            borderRadius: 8, 
            background: "#002b54", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center" 
          }}>
            <Sparkles size={16} color="#fff" />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>
              Análisis con Groq AI ⚡
            </p>
            <p style={{ fontSize: 11, color: "#999", marginTop: 1 }}>
              Generado con IA (Llama 3) - Rápido y preciso
            </p>
          </div>
        </div>
        <button 
          className="btn-primary" 
          onClick={generarInsight} 
          disabled={cargando}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            opacity: cargando ? 0.6 : 1,
            cursor: cargando ? 'not-allowed' : 'pointer'
          }}
        >
          {cargando ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Sparkles size={14} />
          )}
          {cargando ? "Analizando con Groq..." : "Generar análisis IA"}
        </button>
      </div>
      
      {error && (
        <div style={{
          padding: 16,
          background: "#fff2f0",
          borderRadius: 8,
          border: "1px solid #ffccc7",
          marginTop: 16
        }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <AlertCircle size={16} color="#ff4d4f" />
            <p style={{ fontSize: 13, color: "#ff4d4f", margin: 0 }}>{error}</p>
          </div>
        </div>
      )}
      
      {insight && (
        <div style={{ marginTop: 20 }}>
          <div style={{ 
            fontSize: 14, 
            color: "#333", 
            lineHeight: 1.75, 
            paddingTop: 20, 
            borderTop: "1px solid #f0f0f0",
            whiteSpace: "pre-wrap"
          }}>
            {insight.split('\n').map((line, i) => (
              <p key={i} style={{ margin: '8px 0' }}>{line}</p>
            ))}
          </div>
          
          {metadata && (
            <div style={{ 
              marginTop: 16, 
              paddingTop: 12,
              fontSize: 11, 
              color: "#999",
              display: "flex",
              gap: 16,
              alignItems: "center",
              borderTop: "1px solid #f0f0f0",
              flexWrap: "wrap"
            }}>
              <CheckCircle size={12} />
              <span>Generado con {metadata.model} (Groq)</span>
              {metadata.metrics?.ticketPromedio && (
                <span>Ticket promedio: ${metadata.metrics.ticketPromedio}</span>
              )}
              {metadata.metrics?.tendencia && (
                <span>Tendencia: {metadata.metrics.tendencia}</span>
              )}
              <span>Tiempo: {metadata.generatedAt ? new Date(metadata.generatedAt).toLocaleTimeString() : ""}</span>
            </div>
          )}
        </div>
      )}
      
      {!insight && !error && (
        <p style={{ fontSize: 13, color: "#bbb", marginTop: 16 }}>
          Presioná el botón para obtener un análisis inteligente de tus ventas usando Groq AI (Llama 3).
        </p>
      )}
    </div>
  );
}