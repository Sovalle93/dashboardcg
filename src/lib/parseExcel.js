import * as XLSX from "xlsx";

export function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
        const parsed = rows
          .filter((r) => r["Fecha/Hora"] && r["Monto $"] !== null)
          .map((r) => {
            const [datePart, timePart] = r["Fecha/Hora"].split(" ");
            const [day, month, year] = datePart.split("-");
            const fecha = new Date(`${year}-${month}-${day}T${timePart}`);
            return {
              id: r["N° Pedido"],
              tipo: r["Tipo"] || "Sin tipo",
              fecha, fechaStr: datePart,
              hora: timePart,
              mes: `${year}-${month}`,
              semana: getWeekLabel(fecha),
              diaSemana: fecha.toLocaleDateString("es-CL", { weekday: "long" }),
              monto: Number(r["Monto $"]) || 0,
              formaPago: r["Forma Pago"] || "Sin dato",
              negocio: r["Negocio"] || "Sin dato",
              sucursal: r["Sucursal"] || "Sin dato",
              estado: r["Estado Proceso"] || "Sin dato",
            };
          });
        resolve(parsed);
      } catch {
        reject(new Error("No se pudo leer el archivo. Verificá que sea un Excel válido (.xls o .xlsx)."));
      }
    };
    reader.onerror = () => reject(new Error("Error al leer el archivo"));
    reader.readAsArrayBuffer(file);
  });
}

function getWeekLabel(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNum = 1 + Math.round(((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return `${d.getFullYear()}-S${String(weekNum).padStart(2, "0")}`;
}

export function formatCLP(monto) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 }).format(monto);
}

export function agregarPorMes(pedidos) {
  const mapa = {};
  pedidos.forEach((p) => {
    if (!mapa[p.mes]) mapa[p.mes] = { mes: p.mes, total: 0, cantidad: 0 };
    mapa[p.mes].total += p.monto;
    mapa[p.mes].cantidad += 1;
  });
  return Object.values(mapa).sort((a, b) => a.mes.localeCompare(b.mes));
}

export function agregarPorSucursal(pedidos) {
  const mapa = {};
  pedidos.forEach((p) => {
    if (!mapa[p.sucursal]) mapa[p.sucursal] = { sucursal: p.sucursal, total: 0, cantidad: 0 };
    mapa[p.sucursal].total += p.monto;
    mapa[p.sucursal].cantidad += 1;
  });
  return Object.values(mapa).sort((a, b) => b.total - a.total);
}

export function agregarPorNegocio(pedidos) {
  const mapa = {};
  pedidos.forEach((p) => {
    if (!mapa[p.negocio]) mapa[p.negocio] = { negocio: p.negocio, total: 0, cantidad: 0 };
    mapa[p.negocio].total += p.monto;
    mapa[p.negocio].cantidad += 1;
  });
  return Object.values(mapa);
}

export function agregarPorFormaPago(pedidos) {
  const mapa = {};
  pedidos.forEach((p) => {
    if (!mapa[p.formaPago]) mapa[p.formaPago] = { formaPago: p.formaPago, cantidad: 0, total: 0 };
    mapa[p.formaPago].cantidad += 1;
    mapa[p.formaPago].total += p.monto;
  });
  return Object.values(mapa).sort((a, b) => b.cantidad - a.cantidad);
}

export function agregarPorDia(pedidos) {
  const mapa = {};
  pedidos.forEach((p) => {
    if (!mapa[p.fechaStr]) mapa[p.fechaStr] = { dia: p.fechaStr, total: 0, cantidad: 0 };
    mapa[p.fechaStr].total += p.monto;
    mapa[p.fechaStr].cantidad += 1;
  });
  return Object.values(mapa).sort((a, b) => a.dia.localeCompare(b.dia));
}

export function agregarPorMesYAnio(pedidos) {
  const MESES = ["01","02","03","04","05","06","07","08","09","10","11","12"];
  const NOMBRES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  const porAnio = {};
  pedidos.forEach((p) => {
    const [anio, mes] = p.mes.split("-");
    if (!porAnio[anio]) porAnio[anio] = {};
    if (!porAnio[anio][mes]) porAnio[anio][mes] = 0;
    porAnio[anio][mes] += p.monto;
  });
  const anios = Object.keys(porAnio).sort();
  return {
    anios,
    data: MESES.map((m, i) => {
      const row = { mes: NOMBRES[i] };
      anios.forEach((a) => { row[a] = porAnio[a]?.[m] || 0; });
      return row;
    }),
  };
}

export function crecimientoVsAnioAnterior(pedidos) {
  const porSucursalAnio = {};
  pedidos.forEach((p) => {
    const anio = p.mes.split("-")[0];
    if (!porSucursalAnio[p.sucursal]) porSucursalAnio[p.sucursal] = {};
    if (!porSucursalAnio[p.sucursal][anio]) porSucursalAnio[p.sucursal][anio] = 0;
    porSucursalAnio[p.sucursal][anio] += p.monto;
  });
  const anios = [...new Set(pedidos.map((p) => p.mes.split("-")[0]))].sort();
  if (anios.length < 2) return { datos: [], anioActual: anios[0], anioAnterior: null };
  const actual = anios[anios.length - 1];
  const anterior = anios[anios.length - 2];
  const datos = Object.entries(porSucursalAnio).map(([sucursal, años]) => {
    const vActual = años[actual] || 0;
    const vAnterior = años[anterior] || 0;
    const pct = vAnterior > 0 ? ((vActual - vAnterior) / vAnterior) * 100 : null;
    return { sucursal, actual: vActual, anterior: vAnterior, pct };
  }).filter((d) => d.actual > 0).sort((a, b) => (b.pct || 0) - (a.pct || 0));
  return { datos, anioActual: actual, anioAnterior: anterior };
}

export function ticketPromedioPorNegocio(pedidos) {
  const mapa = {};
  pedidos.forEach((p) => {
    if (!mapa[p.negocio]) mapa[p.negocio] = { negocio: p.negocio, total: 0, cantidad: 0 };
    mapa[p.negocio].total += p.monto;
    mapa[p.negocio].cantidad += 1;
  });
  return Object.values(mapa).map((d) => ({ ...d, promedio: Math.round(d.total / d.cantidad) }));
}

export function ticketPromedioPorTipo(pedidos) {
  const mapa = {};
  pedidos.forEach((p) => {
    if (!mapa[p.tipo]) mapa[p.tipo] = { tipo: p.tipo, total: 0, cantidad: 0 };
    mapa[p.tipo].total += p.monto;
    mapa[p.tipo].cantidad += 1;
  });
  return Object.values(mapa).map((d) => ({ ...d, promedio: Math.round(d.total / d.cantidad) })).sort((a, b) => b.promedio - a.promedio);
}