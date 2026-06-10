// utils/filterUtils.js
export const filterDataByNegocio = (data, negocio) => {
  if (!negocio || negocio === 'todos') return data;
  return data.filter(item => item.negocio === negocio);
};

export const filterDataBySucursal = (data, sucursal) => {
  if (!sucursal || sucursal === 'todos') return data;
  return data.filter(item => item.sucursal === sucursal);
};

export const filterDataByTipo = (data, tipo) => {
  if (!tipo || tipo === 'todos') return data;
  return data.filter(item => item.tipo === tipo);
};

export const filterDataByDateRange = (data, startDate, endDate) => {
  if (!startDate && !endDate) return data;
  
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  
  return data.filter(item => {
    const itemDate = new Date(item.fecha);
    if (start && itemDate < start) return false;
    if (end && itemDate > end) return false;
    return true;
  });
};

export const applyAllFilters = (data, filters) => {
  let filtered = [...data];
  
  filtered = filterDataByNegocio(filtered, filters.negocio);
  filtered = filterDataBySucursal(filtered, filters.sucursal);
  filtered = filterDataByTipo(filtered, filters.tipo);
  filtered = filterDataByDateRange(filtered, filters.fechaInicio, filters.fechaFin);
  
  return {
    data: filtered,
    stats: {
      totalVentas: filtered.reduce((sum, i) => sum + (i.monto || 0), 0),
      totalPedidos: filtered.length,
      sucursales: [...new Set(filtered.map(i => i.sucursal))].length,
      ticketPromedio: filtered.length > 0 
        ? Math.round(filtered.reduce((sum, i) => sum + (i.monto || 0), 0) / filtered.length) 
        : 0
    }
  };
};

export const getAvailableFilters = (data) => {
  return {
    negocios: ['todos', ...new Set(data.map(item => item.negocio).filter(Boolean))],
    sucursales: ['todos', ...new Set(data.map(item => item.sucursal).filter(Boolean))],
    tipos: ['todos', ...new Set(data.map(item => item.tipo).filter(Boolean))],
    dateRange: {
      min: data.length ? new Date(Math.min(...data.map(d => new Date(d.fecha)))) : null,
      max: data.length ? new Date(Math.max(...data.map(d => new Date(d.fecha)))) : null
    }
  };
};