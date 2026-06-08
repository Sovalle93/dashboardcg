// app/page.js
"use client";
import { useState } from "react";
import { parseExcelFile, agregarPorMes, agregarPorSucursal, agregarPorNegocio, agregarPorFormaPago, agregarPorMesYAnio, agregarPorDia, crecimientoVsAnioAnterior, ticketPromedioPorNegocio, ticketPromedioPorTipo, formatCLP } from "@/lib/parseExcel";
import { UploadCloud, BarChart2, RefreshCw } from "lucide-react";
import ResumenCards from "@/components/ui/ResumenCards";
import InsightIA from "@/components/ui/InsightIA";
import SinDatos from "@/components/ui/SinDatos";
import VentasHistoricas from "@/components/charts/VentasHistoricas";
import VentasAnualesComparativo from "@/components/charts/VentasAnualesComparativo";
import CrecimientoVsAnterior from "@/components/charts/CrecimientoVsAnterior";
import EvolucionDiaria from "@/components/charts/EvolucionDiaria";
import TicketPromedio from "@/components/charts/TicketPromedio";
import GraficoNegocios from "@/components/charts/GraficoNegocios";
import RankingLocales from "@/components/charts/RankingLocales";
import GraficoSucursales from "@/components/charts/GraficoSucursales";
import Tabs from "@/components/ui/Tabs";
import { HistorialButton, HistorialModal, useHistorial } from "@/components/ui/historial";

function Seccion({ titulo }) {
  return (
    <div style={{ marginTop: 16, marginBottom: 8 }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: "#002b54", textTransform: "uppercase", letterSpacing: "0.1em", borderLeft: "3px solid #002b54", paddingLeft: 12 }}>{titulo}</p>
    </div>
  );
}

export default function Home() {
  // Estado principal
  const [pedidos, setPedidos] = useState([]);
  const [archivos, setArchivos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [tabActivo, setTabActivo] = useState("general");
  const [modalHistorialAbierto, setModalHistorialAbierto] = useState(false);
  
  // Hook de historial modular
  const { 
    historial, 
    agregarRegistro, 
    eliminarRegistro, 
    eliminarTodos,
    obtenerEstadisticas 
  } = useHistorial();

  // Procesar archivos subidos
  async function handleArchivos(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    setCargando(true);
    setError(null);
    
    try {
      const resultados = await Promise.all(files.map((f) => parseExcelFile(f)));
      const nuevosPedidos = resultados.flat();
      
      setPedidos(nuevosPedidos);
      setArchivos(files.map((f) => f.name));
      
      // Guardar en historial usando el hook
      agregarRegistro(nuevosPedidos, files.map(f => f.name));
      
    } catch (err) {
      setError(err.message);
      console.error("Error al procesar archivos:", err);
    } finally {
      setCargando(false);
    }
  }

  // Cargar un registro histórico
  const handleCargarRegistro = (registro) => {
    if (confirm(`¿Cargar datos de "${registro.archivos.join(', ')}"?\n\nEsto reemplazará los datos actuales.`)) {
      setPedidos(registro.datos);
      setArchivos(registro.archivos);
      setModalHistorialAbierto(false);
    }
  };

  // Calcular datos derivados
  const datosCalculados = {
    datosMes: agregarPorMes(pedidos),
    datosSucursal: agregarPorSucursal(pedidos),
    datosNegocio: agregarPorNegocio(pedidos),
    datosFormaPago: agregarPorFormaPago(pedidos),
    datosHistoricos: agregarPorMesYAnio(pedidos),
    datosDiarios: agregarPorDia(pedidos),
    datosCrecimiento: crecimientoVsAnioAnterior(pedidos),
    datosTicketNegocio: ticketPromedioPorNegocio(pedidos),
    datosTicketTipo: ticketPromedioPorTipo(pedidos)
  };

  const totalVentas = pedidos.reduce((s, p) => s + p.monto, 0);
  const totalPedidos = pedidos.length;
  const ticketPromedio = totalPedidos > 0 ? Math.round(totalVentas / totalPedidos) : 0;
  const sucursales = [...new Set(pedidos.map((p) => p.sucursal))].length;

  // Renderizar contenido según pestaña
  const renderContenido = () => {
    switch(tabActivo) {
      case "general":
        return (
          <>
            <ResumenCards 
              totalVentas={totalVentas} 
              totalPedidos={totalPedidos} 
              ticketPromedio={ticketPromedio} 
              sucursales={sucursales} 
              formatCLP={formatCLP} 
            />
            <div style={{ marginTop: 24 }}>
              <InsightIA 
                totalVentas={totalVentas} 
                totalPedidos={totalPedidos} 
                datosMes={datosCalculados.datosMes} 
                datosSucursal={datosCalculados.datosSucursal} 
              />
            </div>
            <Seccion titulo="Ventas históricas" />
            <div className="grid-2" style={{ marginTop: 8 }}>
              <VentasHistoricas datos={datosCalculados.datosHistoricos} formatCLP={formatCLP} />
              <RankingLocales datos={datosCalculados.datosSucursal} formatCLP={formatCLP} />
            </div>
          </>
        );
      
      case "ventas":
        return (
          <>
            <Seccion titulo="Evolución de ventas" />
            <div className="grid-2">
              <VentasHistoricas datos={datosCalculados.datosHistoricos} formatCLP={formatCLP} />
              <VentasAnualesComparativo datos={datosCalculados.datosHistoricos} formatCLP={formatCLP} />
              <EvolucionDiaria datos={datosCalculados.datosDiarios} formatCLP={formatCLP} />
              <GraficoNegocios datos={datosCalculados.datosNegocio} formatCLP={formatCLP} />
            </div>
          </>
        );
      
      case "sucursales":
        return (
          <>
            <Seccion titulo="Rendimiento por sucursal" />
            <div className="grid-2">
              <GraficoSucursales datos={datosCalculados.datosSucursal} formatCLP={formatCLP} />
              <RankingLocales datos={datosCalculados.datosSucursal} formatCLP={formatCLP} />
              <CrecimientoVsAnterior datos={datosCalculados.datosCrecimiento} formatCLP={formatCLP} />
            </div>
          </>
        );
      
      case "crecimiento":
        return (
          <>
            <Seccion titulo="Análisis de crecimiento" />
            <div className="grid-2">
              <CrecimientoVsAnterior datos={datosCalculados.datosCrecimiento} formatCLP={formatCLP} />
              <VentasAnualesComparativo datos={datosCalculados.datosHistoricos} formatCLP={formatCLP} />
            </div>
          </>
        );
      
      case "tickets":
        return (
          <>
            <Seccion titulo="Ticket promedio" />
            <div className="grid-2">
              <TicketPromedio 
                datosNegocio={datosCalculados.datosTicketNegocio} 
                datosTipo={datosCalculados.datosTicketTipo} 
                formatCLP={formatCLP} 
              />
            </div>
          </>
        );
      
      case "avanzado":
        return (
          <>
            <Seccion titulo="Métricas avanzadas" />
            <div className="grid-2">
              <SinDatos titulo="Venta por m² x local" razon="Se necesita la superficie en m² de cada local. Esta información no viene en el Excel de pedidos." />
              <SinDatos titulo="Venta por m² x local x mes (UF)" razon="Se necesita la superficie en m² de cada local y el valor UF histórico." />
              <SinDatos titulo="Crecimiento por canal" razon="El archivo Excel no incluye la columna 'Canal de venta'." />
              <SinDatos titulo="ROI por sucursal" razon="Se requieren datos de costos operativos no incluidos en el Excel." />
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  const estadisticas = obtenerEstadisticas();

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8" }}>
      {/* Header */}
      <header style={{ background: "#002b54", boxShadow: "0 2px 12px rgba(0,0,0,0.15)" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "18px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BarChart2 size={22} color="#fff" />
            </div>
            <div>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: 17, lineHeight: 1.2 }}>Cerogrado</p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 2 }}>Sistema de Reportes · Trampoline Park</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
              {new Date().toLocaleDateString("es-CL", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>
      </header>

      {/* Upload hero - Estado sin datos */}
      {pedidos.length === 0 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px" }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "56px 48px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", maxWidth: 480, width: "100%", textAlign: "center", border: "1px solid #e8e8e8" }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: "#002b54", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <UploadCloud size={30} color="#fff" />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111", marginBottom: 10 }}>Cargá tu informe de ventas</h2>
            <p style={{ fontSize: 14, color: "#888", lineHeight: 1.6, marginBottom: 32 }}>
              Subí uno o varios archivos Excel para generar el dashboard comparativo con análisis de inteligencia artificial.
            </p>
            <label className="btn-primary" style={{ justifyContent: "center", width: "100%", cursor: "pointer" }}>
              <UploadCloud size={16} />
              {cargando ? "Procesando..." : "Seleccionar archivos Excel"}
              <input type="file" accept=".xls,.xlsx" multiple style={{ display: "none" }} onChange={handleArchivos} disabled={cargando} />
            </label>
            {error && (
              <p style={{ marginTop: 16, color: "#e53e3e", fontSize: 13, background: "#fff5f5", padding: 12, borderRadius: 8 }}>
                ❌ {error}
              </p>
            )}
            
            {/* Mostrar historial aunque no haya datos cargados */}
            {estadisticas.totalRegistros > 0 && (
              <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid #e8e8e8" }}>
                <p style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>📚 Historial disponible</p>
                <HistorialButton 
                  onClick={() => setModalHistorialAbierto(true)}
                  totalRegistros={estadisticas.totalRegistros}
                  abierto={modalHistorialAbierto}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dashboard con datos cargados */}
      {pedidos.length > 0 && (
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "40px 40px 80px" }}>
          
          {/* Toolbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111" }}>Informe de gestión</h2>
              <p style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                {archivos.join(" · ")}
              </p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <label className="btn-secondary" style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                <RefreshCw size={14} />
                Subir más datos
                <input type="file" accept=".xls,.xlsx" multiple style={{ display: "none" }} onChange={handleArchivos} />
              </label>
              <HistorialButton 
                onClick={() => setModalHistorialAbierto(true)}
                totalRegistros={estadisticas.totalRegistros}
                abierto={modalHistorialAbierto}
              />
            </div>
          </div>

          {/* Tabs de navegación */}
          <Tabs activo={tabActivo} onChange={setTabActivo} />
          
          {/* Contenido dinámico */}
          <div style={{ marginTop: 32 }}>
            {renderContenido()}
          </div>

          {/* Footer */}
          <p style={{ textAlign: "center", fontSize: 11, color: "#bbb", marginTop: 48, paddingTop: 24, borderTop: "1px solid #e8e8e8" }}>
            Dashboard generado con IA · Cerogrado © {new Date().getFullYear()}
          </p>
        </div>
      )}

      {/* Modal de historial */}
      {modalHistorialAbierto && (
        <HistorialModal 
          historial={historial}
          onClose={() => setModalHistorialAbierto(false)}
          onCargarRegistro={handleCargarRegistro}
          onEliminarRegistro={eliminarRegistro}
          onEliminarTodos={() => {
            eliminarTodos();
            // Si el historial se vacía y no hay datos, limpiar el estado actual
            if (pedidos.length > 0) {
              setPedidos([]);
              setArchivos([]);
            }
          }}
        />
      )}
    </div>
  );
}