// app/utils/validators.js
export class DataValidator {
  static validateVentasData(data) {
    const errors = [];
    
    if (!data || typeof data !== 'object') {
      errors.push('Datos inválidos o vacíos');
      return { isValid: false, errors };
    }
    
    // Validar tipos y valores
    if (data.totalVentas !== undefined && typeof data.totalVentas !== 'number') {
      errors.push('totalVentas debe ser un número');
    }
    
    if (data.totalPedidos !== undefined && typeof data.totalPedidos !== 'number') {
      errors.push('totalPedidos debe ser un número');
    }
    
    if (data.totalVentas < 0) {
      errors.push('totalVentas no puede ser negativo');
    }
    
    if (data.totalPedidos < 0) {
      errors.push('totalPedidos no puede ser negativo');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: {
        totalVentas: Math.max(0, data.totalVentas || 0),
        totalPedidos: Math.max(0, data.totalPedidos || 0),
        datosMes: data.datosMes || [],
        datosSucursal: data.datosSucursal || {}
      }
    };
  }
}