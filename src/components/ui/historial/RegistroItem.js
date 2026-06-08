"use client";
import { useState } from "react";
import { Calendar, Trash2, CheckCircle } from "lucide-react";

const formatearFecha = (fechaISO) => {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

export function RegistroItem({ 
  registro, 
  modoComparacion, 
  seleccionado, 
  onSelect, 
  onCargar, 
  onEliminar,
  mostrarEliminar
}) {
  const [eliminando, setEliminando] = useState(false);

  const handleEliminar = async (e) => {
    e.stopPropagation();
    if (confirm(`¿Eliminar registro de "${registro.archivos.join(', ')}"?`)) {
      setEliminando(true);
      setTimeout(() => {
        onEliminar(registro.id);
      }, 300);
    }
  };

  const handleClick = () => {
    if (modoComparacion) {
      onSelect(registro.id);
    }
  };

  const handleCargar = (e) => {
    e.stopPropagation();
    onCargar(registro);
  };

  return (
    <div 
      style={{
        padding: "16px 20px",
        borderBottom: "1px solid #f0f0f0",
        transition: "all 0.2s",
        background: seleccionado ? "#e8f4f8" : eliminando ? "transparent" : "#fff",
        cursor: modoComparacion ? "pointer" : "default",
        opacity: eliminando ? 0 : 1,
        transform: eliminando ? "translateX(-20px)" : "none",
        transition: "opacity 0.3s ease-out, transform 0.3s ease-out, background 0.2s"
      }}
      onClick={handleClick}
      onMouseEnter={(e) => {
        if (!modoComparacion && !eliminando) {
          e.currentTarget.style.background = "#fafafa";
        }
      }}
      onMouseLeave={(e) => {
        if (!modoComparacion && !eliminando) {
          e.currentTarget.style.background = seleccionado ? "#e8f4f8" : "#fff";
        }
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: seleccionado ? "#002b54" : "#002b5410",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}>
          {modoComparacion && seleccionado ? (
            <CheckCircle size={20} color="#fff" />
          ) : (
            <Calendar size={18} color={seleccionado ? "#fff" : "#002b54"} />
          )}
        </div>
        
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#111", margin: 0 }}>
                {registro.archivos.join(", ")}
              </p>
              <p style={{ fontSize: 11, color: "#999", marginTop: 4 }}>
                {formatearFecha(registro.fecha)}
              </p>
            </div>
            
            {!modoComparacion && (
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={handleCargar}
                  style={{
                    padding: "6px 12px",
                    fontSize: 11,
                    background: "#002b54",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer"
                  }}
                >
                  Cargar
                </button>
                {mostrarEliminar && (
                  <button
                    onClick={handleEliminar}
                    style={{
                      padding: "6px 12px",
                      fontSize: 12,
                      background: "#fff",
                      color: "#e53e3e",
                      border: "1px solid #e53e3e",
                      borderRadius: 6,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div style={{
            display: "flex",
            gap: 20,
            fontSize: 12,
            color: "#666",
            flexWrap: "wrap"
          }}>
            <span>💰 ${registro.totalVentas.toLocaleString()}</span>
            <span>📦 {registro.totalPedidos} pedidos</span>
            {registro.fechaInicio && (
              <span>📅 {new Date(registro.fechaInicio).toLocaleDateString()} → {new Date(registro.fechaFin).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}