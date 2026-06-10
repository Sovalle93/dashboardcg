"use client";
import { useState, useMemo } from "react";
import {
  parseExcelFile,
  agregarPorMes,
  agregarPorSucursal,
  agregarPorNegocio,
  agregarPorFormaPago,
  agregarPorMesYAnio,
  agregarPorDia,
  agregarPorAnio,
  agregarPorTipo,
  agregarPorMesYNegocio,
  crecimientoVsAnioAnterior,
  ticketPromedioPorNegocio,
  ticketPromedioPorTipo,
  formatCLP
} from "@/lib/parseExcel";
import { Upload, RotateCcw } from "lucide-react";
import { FilterProvider, useFilterContext } from "@/components/context/filterContext";
import { FilterBar } from "@/components/filters/FilterBar";
import { GlobalResumenCards } from "@/components/layout/GlobalResumenCards";
import AppHeader from "@/components/layout/AppHeader";
import InsightIA from "@/components/ui/InsightIA";
import SinDatos from "@/components/ui/SinDatos";
import VentasHistoricas from "@/components/charts/VentasHistoricas";
import VentasAnualesComparativo from "@/components/charts/VentasAnualesComparativo";
import VentasAnualesTotal from "@/components/charts/VentasAnualesTotal";
import CrecimientoVsAnterior from "@/components/charts/CrecimientoVsAnterior";
import EvolucionDiaria from "@/components/charts/EvolucionDiaria";
import TicketPromedio from "@/components/charts/TicketPromedio";
import GraficoNegocios from "@/components/charts/GraficoNegocios";
import RankingLocales from "@/components/charts/RankingLocales";
import GraficoSucursales from "@/components/charts/GraficoSucursales";
import GraficoCantidadTipo from "@/components/charts/GraficoCantidadTipo";
import VentasNegocioLineas from "@/components/charts/VentasNegocioLineas";
import GraficoFormaPago from "@/components/charts/GraficoFormaPago";
import Tabs from "@/components/ui/Tabs";
import { HistorialButton, HistorialModal, useHistorial } from "@/components/ui/historial";
import EmptyState from "@/components/ui/EmptyState";

function Seccion({ titulo, theme }) {
  return (
    <div style={{ marginTop: 16, marginBottom: 8 }}>
      <p style={{
        fontSize: 13,
        fontWeight: 700,
        color: "#002b54",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        borderLeft: `3px solid ${theme?.accent ?? '#002b54'}`,
        paddingLeft: 12
      }}>{titulo}</p>
    </div>
  );
}

// Switches the primary time-series chart based on the granularidad filter.
function TiempoChart({ granularidad, datosCalculados, theme }) {
  if (granularidad === "diario") {
    return <EvolucionDiaria datos={datosCalculados.datosDiarios} formatCLP={formatCLP} theme={theme} />;
  }
  if (granularidad === "anual") {
    return <VentasAnualesTotal datos={datosCalculados.datosAnuales} formatCLP={formatCLP} theme={theme} />;
  }
  // default: mensual
  return <VentasHistoricas datos={datosCalculados.datosHistoricos} formatCLP={formatCLP} theme={theme} />;
}

function DashboardContent({
  archivos,
  onSubirArchivos,
  cargando,
  onCargarRegistro,
  onResetTool,
  historial,
  onEliminarRegistro,
  onEliminarTodos,
  obtenerEstadisticas
}) {
  // All chart data comes from filteredData so every filter (negocio, sucursal,
  // fecha, granularidad) is reflected immediately in the charts.
  const { filteredData, filters, theme } = useFilterContext();
  const [tabActivo, setTabActivo] = useState("general");
  const [modalHistorialAbierto, setModalHistorialAbierto] = useState(false);

  const datosCalculados = useMemo(() => ({
    datosMes: agregarPorMes(filteredData),
    datosSucursal: agregarPorSucursal(filteredData),
    datosNegocio: agregarPorNegocio(filteredData),
    datosFormaPago: agregarPorFormaPago(filteredData),
    datosHistoricos: agregarPorMesYAnio(filteredData),
    datosDiarios: agregarPorDia(filteredData),
    datosAnuales: agregarPorAnio(filteredData),
    datosCrecimiento: crecimientoVsAnioAnterior(filteredData),
    datosTicketNegocio: ticketPromedioPorNegocio(filteredData),
    datosTicketTipo: ticketPromedioPorTipo(filteredData),
    datosTipo: agregarPorTipo(filteredData),
    datosNegocioLineas: agregarPorMesYNegocio(filteredData),
    totalVentas: filteredData.reduce((s, p) => s + p.monto, 0),
  }), [filteredData]);

  const renderContenido = () => {
    switch (tabActivo) {
      case "general":
        return (
          <>
            <Seccion titulo="Ventas históricas" theme={theme} />
            <div className="grid-2">
              <VentasNegocioLineas datos={datosCalculados.datosNegocioLineas} formatCLP={formatCLP} />
              <TiempoChart granularidad={filters.granularidad} datosCalculados={datosCalculados} theme={theme} />
              <RankingLocales datos={datosCalculados.datosSucursal} formatCLP={formatCLP} theme={theme} />
            </div>
            <Seccion titulo="Análisis IA" theme={theme} />
            <InsightIA
              totalVentas={datosCalculados.totalVentas}
              totalPedidos={filteredData.length}
              datosMes={datosCalculados.datosMes}
              datosSucursal={datosCalculados.datosSucursal}
            />
          </>
        );

      case "ventas":
        return (
          <div className="grid-2">
            <VentasNegocioLineas datos={datosCalculados.datosNegocioLineas} formatCLP={formatCLP} />
            <TiempoChart granularidad={filters.granularidad} datosCalculados={datosCalculados} theme={theme} />
            <VentasAnualesComparativo datos={datosCalculados.datosHistoricos} formatCLP={formatCLP} theme={theme} />
            <GraficoNegocios datos={datosCalculados.datosNegocio} formatCLP={formatCLP} theme={theme} />
            <GraficoFormaPago datos={datosCalculados.datosFormaPago} formatCLP={formatCLP} theme={theme} />
          </div>
        );

      case "sucursales":
        return (
          <div className="grid-2">
            <GraficoSucursales datos={datosCalculados.datosSucursal} formatCLP={formatCLP} theme={theme} />
            <RankingLocales datos={datosCalculados.datosSucursal} formatCLP={formatCLP} theme={theme} />
            <CrecimientoVsAnterior datos={datosCalculados.datosCrecimiento} formatCLP={formatCLP} theme={theme} />
          </div>
        );

      case "crecimiento":
        return (
          <div className="grid-2">
            <CrecimientoVsAnterior datos={datosCalculados.datosCrecimiento} formatCLP={formatCLP} theme={theme} />
            <VentasAnualesComparativo datos={datosCalculados.datosHistoricos} formatCLP={formatCLP} theme={theme} />
          </div>
        );

      case "tickets":
        return (
          <div className="grid-2">
            <TicketPromedio
              datosNegocio={datosCalculados.datosTicketNegocio}
              datosTipo={datosCalculados.datosTicketTipo}
              formatCLP={formatCLP}
              theme={theme}
            />
            <GraficoCantidadTipo datos={datosCalculados.datosTipo} formatCLP={formatCLP} theme={theme} />
          </div>
        );

      case "avanzado":
        return (
          <div className="grid-2">
            <SinDatos titulo="Venta por m² x local" razon="Se necesita la superficie en m² de cada local. Esta información no viene en el Excel de pedidos." />
            <SinDatos titulo="Venta por m² x local x mes (UF)" razon="Se necesita la superficie en m² de cada local y el valor UF histórico." />
            <SinDatos titulo="Crecimiento por canal" razon="El archivo Excel no incluye la columna 'Canal de venta'." />
            <SinDatos titulo="ROI por sucursal" razon="Se requieren datos de costos operativos no incluidos en el Excel." />
          </div>
        );

      default:
        return null;
    }
  };

  const estadisticas = obtenerEstadisticas();

  return (
    <div style={{ maxWidth: 1140, margin: "0 auto", padding: "40px 40px 80px" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 24,
        flexWrap: "wrap",
        gap: 16
      }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111" }}>Informe de gestión</h2>
          <p style={{ fontSize: 12, color: "#999", marginTop: 4 }}>{archivos.join(" · ")}</p>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <label className="btn-secondary" style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <Upload size={14} />
            Subir más datos
            <input type="file" accept=".xls,.xlsx" multiple style={{ display: "none" }} onChange={onSubirArchivos} disabled={cargando} />
          </label>

          <button
            onClick={onResetTool}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              fontSize: 13,
              background: "#fff",
              color: "#e53e3e",
              border: "1px solid #e53e3e",
              borderRadius: 10,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#e53e3e"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#e53e3e"; }}
          >
            <RotateCcw size={14} />
            Resetear herramienta
          </button>

          <div style={{ position: "relative" }}>
            <HistorialButton
              onClick={() => setModalHistorialAbierto(true)}
              totalRegistros={estadisticas.totalRegistros}
              abierto={modalHistorialAbierto}
            />
            {modalHistorialAbierto && (
              <HistorialModal
                historial={historial}
                onClose={() => setModalHistorialAbierto(false)}
                onCargarRegistro={(registro) => {
                  onCargarRegistro(registro);
                  setModalHistorialAbierto(false);
                }}
                onEliminarRegistro={onEliminarRegistro}
                onEliminarTodos={onEliminarTodos}
              />
            )}
          </div>
        </div>
      </div>

      <FilterBar />
      <GlobalResumenCards />
      <Tabs activo={tabActivo} onChange={setTabActivo} />

      <div style={{ marginTop: 32 }}>
        {renderContenido()}
      </div>

      <p style={{
        textAlign: "center",
        fontSize: 11,
        color: "#bbb",
        marginTop: 48,
        paddingTop: 24,
        borderTop: "1px solid #e8e8e8"
      }}>
        Dashboard generado con IA · Cerogrado © {new Date().getFullYear()}
      </p>
    </div>
  );
}

export default function Home() {
  const [pedidos, setPedidos] = useState([]);
  const [archivos, setArchivos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const { historial, agregarRegistro, eliminarRegistro, eliminarTodos, obtenerEstadisticas } = useHistorial();

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
      agregarRegistro(nuevosPedidos, files.map((f) => f.name));
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  const handleResetTool = () => {
    if (confirm("⚠️ ¿Resetear la herramienta?\n\nEsta acción eliminará los datos actuales. El historial se mantendrá.")) {
      setPedidos([]);
      setArchivos([]);
      setError(null);
    }
  };

  const handleCargarRegistro = (registro) => {
    if (confirm(`¿Cargar datos de "${registro.archivos.join(", ")}"?`)) {
      setPedidos(registro.datos ?? []);
      setArchivos(registro.archivos);
    }
  };

  if (pedidos.length === 0) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8f8f8" }}>
        <AppHeader />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px" }}>
          <div style={{ width: "100%", maxWidth: 480 }}>
            <EmptyState
              title="Cargá tu informe de ventas"
              description="Subí uno o varios archivos Excel para generar el dashboard comparativo con análisis de inteligencia artificial."
              icon="upload"
              actionText={cargando ? "Procesando..." : "Seleccionar archivos Excel"}
              onAction={() => document.getElementById("file-input")?.click()}
            />
            <input
              id="file-input"
              type="file"
              accept=".xls,.xlsx"
              multiple
              style={{ display: "none" }}
              onChange={handleArchivos}
              disabled={cargando}
            />
            {error && <p style={{ textAlign: "center", color: "#e53e3e", fontSize: 13, marginTop: 12 }}>{error}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8" }}>
      <AppHeader />
      <FilterProvider data={pedidos}>
        <DashboardContent
          archivos={archivos}
          onSubirArchivos={handleArchivos}
          cargando={cargando}
          onCargarRegistro={handleCargarRegistro}
          onResetTool={handleResetTool}
          historial={historial}
          onEliminarRegistro={eliminarRegistro}
          onEliminarTodos={eliminarTodos}
          obtenerEstadisticas={obtenerEstadisticas}
        />
      </FilterProvider>
    </div>
  );
}
