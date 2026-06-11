"use client";
import { useState } from "react";
import { FileText } from "lucide-react";
import { exportarAPDF } from "./utils";

export function ExportPanel({ historial, periodoSeleccionado, setPeriodoSeleccionado, comparacionIds }) {
  const [exportando, setExportando] = useState(false);

  const handleExport = async () => {
    let pedidosExportar = [];
    let titulo = "";

    if (periodoSeleccionado === "todos") {
      pedidosExportar = historial.flatMap(r => r.datos || []);
      titulo = `Todos los registros (${historial.length} períodos)`;
    } else if (periodoSeleccionado === "comparacion" && comparacionIds.length > 0) {
      pedidosExportar = historial
        .filter(r => comparacionIds.includes(r.id))
        .flatMap(r => r.datos || []);
      titulo = `Comparación — ${comparacionIds.length} períodos`;
    } else {
      const registro = historial.find(r => r.id === parseInt(periodoSeleccionado));
      pedidosExportar = registro?.datos || [];
      titulo = registro ? registro.archivos.join(", ") : "Reporte";
    }

    setExportando(true);
    try {
      await exportarAPDF(pedidosExportar, titulo);
    } finally {
      setExportando(false);
    }
  };

  return (
    <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "16px", marginTop: 8 }}>
      <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 10, opacity: 0.9 }}>
        📄 Exportar informe PDF
      </label>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <select
          value={periodoSeleccionado}
          onChange={(e) => setPeriodoSeleccionado(e.target.value)}
          style={{
            flex: 2,
            minWidth: 180,
            padding: "10px 14px",
            border: "none",
            borderRadius: 10,
            fontSize: 13,
            background: "#fff",
            color: "#333",
            cursor: "pointer"
          }}
        >
          <option value="todos">📦 Todos los registros ({historial.length} períodos)</option>
          {historial.map(h => (
            <option key={h.id} value={h.id}>
              📄 {h.archivos.join(", ")} — {new Date(h.fecha).toLocaleDateString()}
            </option>
          ))}
          {comparacionIds.length > 0 && (
            <option value="comparacion">📊 Comparación ({comparacionIds.length} períodos)</option>
          )}
        </select>
      </div>
    </div>
  );
}
