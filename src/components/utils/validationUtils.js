// utils/validationUtils.js
export const validateData = (data, requiredFields = []) => {
  if (!data || !Array.isArray(data)) {
    return { isValid: false, error: 'No hay datos disponibles' };
  }
  
  if (data.length === 0) {
    return { isValid: false, error: 'No se encontraron registros' };
  }
  
  const missingFields = [];
  requiredFields.forEach(field => {
    if (!data.some(item => item[field] !== undefined && item[field] !== null && item[field] !== '')) {
      missingFields.push(field);
    }
  });
  
  return {
    isValid: missingFields.length === 0,
    error: missingFields.length ? `Faltan datos para: ${missingFields.join(', ')}` : null,
    missingFields
  };
};

export const validateFilterValues = (filters, availableValues) => {
  const errors = [];
  
  if (filters.negocio && !availableValues.negocios?.includes(filters.negocio)) {
    errors.push(`El negocio "${filters.negocio}" no existe`);
  }
  
  if (filters.sucursal && !availableValues.sucursales?.includes(filters.sucursal)) {
    errors.push(`La sucursal "${filters.sucursal}" no existe`);
  }
  
  return { isValid: errors.length === 0, errors };
};