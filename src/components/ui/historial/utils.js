import * as XLSX from "xlsx";

export const formatearFecha = (fechaISO) => {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

export const formatearFechaCorta = (fecha) => {
  if (!fecha) return "N/A";
  const d = new Date(fecha);
  return d.toLocaleDateString("es-CL");
};

export const exportarAExcel = (pedidosExportar, titulo = "Reporte") => {
  if (pedidosExportar.length === 0) {
    alert("⚠️ No hay datos para exportar");
    return false;
  }

  const datosExcel = pedidosExportar.map(p => ({
    "📅 Fecha": p.fecha,
    "🏢 Sucursal": p.sucursal,
    "💰 Monto": p.monto,
    "🏷️ Negocio": p.negocio || "No especificado",
    "💳 Forma de Pago": p.formaPago || "No especificada",
    "🔧 Método": p.metodo || "No especificado"
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(datosExcel);
  ws['!cols'] = [{ wch: 20 }, { wch: 30 }, { wch: 15 }, { wch: 25 }, { wch: 20 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, ws, "Detalle Ventas");

  const totalVentas = pedidosExportar.reduce((s, p) => s + p.monto, 0);
  const resumen = [
    ["📊 RESUMEN EJECUTIVO", ""],
    ["Período:", titulo],
    ["Fecha exportación:", new Date().toLocaleString("es-CL")],
    ["", ""],
    ["💰 TOTAL VENTAS:", `$${totalVentas.toLocaleString()}`],
    ["📦 TOTAL PEDIDOS:", pedidosExportar.length]
  ];
  
  const wsResumen = XLSX.utils.aoa_to_sheet(resumen);
  XLSX.utils.book_append_sheet(wb, wsResumen, "Resumen");

  const fecha = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `reporte_ventas_${fecha}.xlsx`);
  
  return true;
};

export const obtenerEstadisticasComparacion = (periodos) => {
  if (periodos.length < 2) return null;
  
  return periodos.map(p => ({
    id: p.id,
    nombre: p.archivos.join(", "),
    fecha: formatearFecha(p.fecha),
    ventas: p.totalVentas,
    pedidos: p.totalPedidos,
    ticket: p.totalPedidos > 0 ? p.totalVentas / p.totalPedidos : 0
  }));
};