// utils/dateUtils.js
import { format, parse, isValid, startOfMonth, endOfMonth, startOfYear, endOfYear, eachDayOfInterval, eachMonthOfInterval, eachYearOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
  if (!date || !isValid(new Date(date))) return 'Fecha inválida';
  return format(new Date(date), formatStr, { locale: es });
};

export const parseExcelDate = (excelDate) => {
  if (!excelDate) return null;
  const date = new Date(excelDate);
  return isValid(date) ? date : null;
};

export const getDateRangeByGranularidad = (granularidad, fechaReferencia = new Date()) => {
  const fecha = new Date(fechaReferencia);
  switch(granularidad) {
    case 'diario':
      return { start: fecha, end: fecha };
    case 'mensual':
      return { start: startOfMonth(fecha), end: endOfMonth(fecha) };
    case 'anual':
      return { start: startOfYear(fecha), end: endOfYear(fecha) };
    default:
      return { start: fecha, end: fecha };
  }
};

export const groupByGranularidad = (data, granularidad, dateKey = 'fecha') => {
  if (!data?.length) return [];
  
  const grupos = {};
  data.forEach(item => {
    const fecha = new Date(item[dateKey]);
    if (!isValid(fecha)) return;
    
    let key;
    switch(granularidad) {
      case 'diario':
        key = format(fecha, 'yyyy-MM-dd');
        break;
      case 'mensual':
        key = format(fecha, 'yyyy-MM');
        break;
      case 'anual':
        key = format(fecha, 'yyyy');
        break;
      default:
        key = format(fecha, 'yyyy-MM-dd');
    }
    
    if (!grupos[key]) grupos[key] = [];
    grupos[key].push(item);
  });
  
  return Object.entries(grupos).map(([key, items]) => ({
    periodo: key,
    totalVentas: items.reduce((sum, i) => sum + (i.monto || 0), 0),
    totalPedidos: items.length,
    items
  }));
};

export const getFechaDesdeArchivos = (pedidos) => {
  if (!pedidos?.length) return null;
  const fechas = pedidos.map(p => new Date(p.fecha)).filter(isValid);
  if (!fechas.length) return null;
  return {
    min: new Date(Math.min(...fechas)),
    max: new Date(Math.max(...fechas))
  };
};