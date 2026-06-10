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

export const exportarAPDF = async (pedidosExportar, titulo = "Reporte") => {
  if (pedidosExportar.length === 0) {
    alert("⚠️ No hay datos para exportar");
    return false;
  }

  const { jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const NAVY = [0, 43, 84];
  const LIGHT_BG = [240, 244, 248];

  const clp = (n) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(n);
  const pct = (n, t) => t > 0 ? ((n / t) * 100).toFixed(1) + '%' : '0%';

  const totalVentas = pedidosExportar.reduce((s, p) => s + p.monto, 0);
  const ticketPromedio = pedidosExportar.length > 0 ? Math.round(totalVentas / pedidosExportar.length) : 0;

  // Aggregate helpers
  const agrupar = (campo) => {
    const mapa = {};
    pedidosExportar.forEach(p => {
      const k = p[campo] || 'Sin dato';
      if (!mapa[k]) mapa[k] = { total: 0, cantidad: 0 };
      mapa[k].total += p.monto;
      mapa[k].cantidad += 1;
    });
    return Object.entries(mapa)
      .map(([key, v]) => ({ key, ...v }))
      .sort((a, b) => b.total - a.total);
  };

  const mesMapa = {};
  pedidosExportar.forEach(p => {
    if (!mesMapa[p.mes]) mesMapa[p.mes] = { total: 0, cantidad: 0 };
    mesMapa[p.mes].total += p.monto;
    mesMapa[p.mes].cantidad += 1;
  });
  const meses = Object.entries(mesMapa)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([mes, v]) => ({ mes, ...v }));

  const negocios = agrupar('negocio');
  const sucursales = agrupar('sucursal').slice(0, 10);
  const tipos = agrupar('tipo').sort((a, b) => b.cantidad - a.cantidad);

  let y = 0;

  // Page header function (called for each page via didDrawPage)
  const drawPageHeader = () => {
    doc.setFillColor(...NAVY);
    doc.rect(0, 0, W, 26, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('CEROGRADO — INFORME DE GESTIÓN', 14, 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(titulo, 14, 17);
    doc.text(`Generado: ${new Date().toLocaleDateString('es-CL')}`, W - 14, 17, { align: 'right' });
  };

  const drawPageFooter = () => {
    const pages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.setFillColor(...NAVY);
      doc.rect(0, H - 8, W, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('Cerogrado · Dashboard de gestión', 14, H - 3);
      doc.text(`Pág. ${i} de ${pages}`, W - 14, H - 3, { align: 'right' });
    }
  };

  const sectionTitle = (label) => {
    if (y > H - 45) { doc.addPage(); drawPageHeader(); y = 34; }
    doc.setFillColor(...NAVY);
    doc.rect(14, y, W - 28, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(label, 16, y + 5);
    doc.setTextColor(0, 0, 0);
    y += 9;
  };

  const drawTable = (head, body) => {
    autoTable(doc, {
      head,
      body,
      startY: y,
      margin: { left: 14, right: 14 },
      styles: { fontSize: 8, cellPadding: 2.5, font: 'helvetica', textColor: [33, 33, 33] },
      headStyles: { fillColor: LIGHT_BG, textColor: NAVY, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [252, 252, 252] },
    });
    y = doc.lastAutoTable.finalY + 7;
  };

  // --- Page 1 ---
  drawPageHeader();
  y = 34;

  // Summary cards
  const cardW = (W - 32) / 3;
  [
    { label: 'TOTAL VENTAS', value: clp(totalVentas) },
    { label: 'TOTAL PEDIDOS', value: pedidosExportar.length.toLocaleString() },
    { label: 'TICKET PROMEDIO', value: clp(ticketPromedio) },
  ].forEach((card, i) => {
    const x = 14 + i * (cardW + 2);
    doc.setFillColor(...LIGHT_BG);
    doc.roundedRect(x, y, cardW, 17, 2, 2, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text(card.label, x + 4, y + 6);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...NAVY);
    doc.text(card.value, x + 4, y + 14);
  });
  y += 24;

  // Ventas por mes
  sectionTitle('VENTAS POR MES');
  drawTable(
    [['Mes', 'Total Ventas', 'N° Pedidos']],
    meses.map(m => [m.mes, clp(m.total), m.cantidad.toLocaleString()])
  );

  // Ventas por negocio
  sectionTitle('VENTAS POR NEGOCIO');
  drawTable(
    [['Negocio', 'Total Ventas', 'N° Pedidos', '% del Total']],
    negocios.map(n => [n.key, clp(n.total), n.cantidad.toLocaleString(), pct(n.total, totalVentas)])
  );

  // Ventas por sucursal (top 10)
  sectionTitle('VENTAS POR SUCURSAL (Top 10)');
  drawTable(
    [['Sucursal', 'Total Ventas', 'N° Pedidos', '% del Total']],
    sucursales.map(s => [s.key, clp(s.total), s.cantidad.toLocaleString(), pct(s.total, totalVentas)])
  );

  // Distribución por tipo
  sectionTitle('DISTRIBUCIÓN POR TIPO DE SERVICIO');
  drawTable(
    [['Tipo', 'N° Pedidos', 'Total Ventas', '% Pedidos']],
    tipos.map(t => [t.key, t.cantidad.toLocaleString(), clp(t.total), pct(t.cantidad, pedidosExportar.length)])
  );

  drawPageFooter();

  const fecha = new Date().toISOString().split('T')[0];
  doc.save(`informe_ventas_${fecha}.pdf`);
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