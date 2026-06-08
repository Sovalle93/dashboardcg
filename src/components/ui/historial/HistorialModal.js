// components/ui/historial/HistorialModal.jsx
"use client";
import { useState, useRef, useEffect } from "react";
import { X, TrendingUp, Trash2, History } from "lucide-react";
import { Portal } from "./usePortal"; 
import { ExportPanel } from "./ExportPanel";
import { RegistroList } from "./RegistroList";
import { EmptyState } from "./EmptyState";
import { ComparacionPanel } from "./ComparacionPanel";
import { obtenerEstadisticasComparacion } from "./utils";

export function HistorialModal({ 
  historial, 
  onClose, 
  onCargarRegistro, 
  onEliminarRegistro,
  onEliminarTodos
}) {
  const [modoComparacion, setModoComparacion] = useState(false);
  const [comparacionIds, setComparacionIds] = useState([]);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("todos");
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [posicion, setPosicion] = useState({ top: 0, right: 0 });
  const buttonRef = useRef(null);

  // Obtener posición del botón al abrir el modal
  useEffect(() => {
    const button = document.querySelector('.historial-button-ref');
    if (button) {
      const rect = button.getBoundingClientRect();
      setPosicion({
        top: rect.bottom + window.scrollY + 8,
        right: window.innerWidth - rect.right + window.scrollX
      });
    }
  }, []);

  const handleToggleComparacion = (id) => {
    setComparacionIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }
      if (prev.length < 3) {
        return [...prev, id];
      }
      alert("⚠️ Solo puedes comparar hasta 3 períodos a la vez");
      return prev;
    });
  };

  const handleEliminarTodos = () => {
    if (confirm("⚠️ ¿Eliminar TODO el historial?\n\nEsta acción eliminará todos los registros permanentemente.")) {
      onEliminarTodos();
      onClose();
    }
  };

  const estadisticasComparacion = modoComparacion && comparacionIds.length > 0
    ? obtenerEstadisticasComparacion(historial.filter(r => comparacionIds.includes(r.id)))
    : null;

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.historial-modal-content')) {
        onClose();
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [onClose]);

  return (
    <Portal>
      <div 
        className="historial-modal-content"
        style={{
          position: "absolute",
          top: posicion.top,
          right: posicion.right,
          width: 560,
          maxWidth: "calc(100vw - 32px)",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
          border: "1px solid #e8e8e8",
          zIndex: 1000,
          overflow: "hidden"
        }}
      >
        {/* Resto del contenido del modal igual que antes */}
        <div style={{ padding: "20px 24px", background: "linear-gradient(135deg, #002b54 0%, #003d6b 100%)", color: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <History size={20} />
                Historial de cargas
              </h3>
              <p style={{ fontSize: 12, opacity: 0.8, marginTop: 6, marginBottom: 0 }}>
                Registro completo de todos los archivos subidos
              </p>
            </div>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, padding: 6, cursor: "pointer" }}>
              <X size={16} color="#fff" />
            </button>
          </div>
          
          <ExportPanel 
            historial={historial}
            periodoSeleccionado={periodoSeleccionado}
            setPeriodoSeleccionado={setPeriodoSeleccionado}
            comparacionIds={comparacionIds}
          />
        </div>
        
        <div style={{ padding: "12px 20px", background: "#fafafa", borderBottom: "1px solid #e8e8e8", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => {
                setModoComparacion(!modoComparacion);
                setComparacionIds([]);
              }}
              style={{
                padding: "6px 12px",
                fontSize: 12,
                background: modoComparacion ? "#002b54" : "#fff",
                color: modoComparacion ? "#fff" : "#666",
                border: "1px solid #ddd",
                borderRadius: 8,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              <TrendingUp size={12} />
              {modoComparacion ? "Salir comparación" : "Comparar períodos"}
            </button>
            
            {mostrarEliminar && (
              <button
                onClick={handleEliminarTodos}
                style={{
                  padding: "6px 12px",
                  fontSize: 12,
                  background: "#fff",
                  color: "#e53e3e",
                  border: "1px solid #e53e3e",
                  borderRadius: 8,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}
              >
                <Trash2 size={12} />
                Eliminar todo
              </button>
            )}
          </div>
          
          <button onClick={() => setMostrarEliminar(!mostrarEliminar)} style={{ padding: "6px 12px", fontSize: 11, background: "transparent", color: "#999", border: "none", cursor: "pointer", textDecoration: "underline" }}>
            {mostrarEliminar ? "Cancelar" : "Administrar historial"}
          </button>
        </div>
        
        {estadisticasComparacion && <ComparacionPanel estadisticas={estadisticasComparacion} />}
        
        {historial.length === 0 ? (
          <EmptyState />
        ) : (
          <RegistroList 
            historial={historial}
            modoComparacion={modoComparacion}
            comparacionIds={comparacionIds}
            onToggleComparacion={handleToggleComparacion}
            onCargarRegistro={onCargarRegistro}
            onEliminarRegistro={onEliminarRegistro}
            mostrarEliminar={mostrarEliminar}
          />
        )}
        
        <div style={{ padding: "14px 20px", background: "#fafafa", borderTop: "1px solid #e8e8e8", fontSize: 11, color: "#999", textAlign: "center", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>💾 Datos almacenados localmente</span>
          <span>📊 {historial.reduce((acc, h) => acc + h.totalPedidos, 0)} pedidos totales</span>
        </div>
      </div>
    </Portal>
  );
}