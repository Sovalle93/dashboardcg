// hooks/useDataFiltering.js
"use client";
import { useState, useMemo } from 'react';
import { applyAllFilters, getAvailableFilters } from '@/utils/filterUtils';
import { validateFilterValues } from '@/utils/validationUtils';

export function useDataFiltering(initialData) {
  const [filters, setFilters] = useState({
    negocio: 'todos',
    sucursal: 'todos',
    fechaInicio: null,
    fechaFin: null,
    granularidad: 'mensual'
  });
  
  const [validationErrors, setValidationErrors] = useState([]);
  
  const availableFilters = useMemo(() => 
    getAvailableFilters(initialData), [initialData]
  );
  
  const filteredResult = useMemo(() => {
    const validation = validateFilterValues(filters, availableFilters);
    setValidationErrors(validation.errors);
    
    if (!validation.isValid) {
      return { data: [], stats: null, validationErrors: validation.errors };
    }
    
    return applyAllFilters(initialData, filters);
  }, [initialData, filters, availableFilters]);
  
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const resetFilters = () => {
    setFilters({
      negocio: 'todos',
      sucursal: 'todos',
      fechaInicio: null,
      fechaFin: null,
      granularidad: 'mensual'
    });
  };
  
  return {
    filters,
    filteredData: filteredResult.data,
    stats: filteredResult.stats,
    availableFilters,
    validationErrors,
    updateFilter,
    resetFilters,
    hasData: filteredResult.data?.length > 0
  };
}