// context/FilterContext.jsx
"use client";
import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { applyAllFilters, getAvailableFilters } from '@/components/utils/filterUtils';

const FilterContext = createContext(null);

export function FilterProvider({ children, data, onDataChange }) {
  const [filters, setFilters] = useState({
    negocio: 'todos',
    sucursal: 'todos',
    fechaInicio: null,
    fechaFin: null,
    granularidad: 'mensual'
  });
  
  const [filteredResult, setFilteredResult] = useState({ data: [], stats: null });
  
  // Actualizar datos filtrados cuando cambian filtros o datos fuente
  useEffect(() => {
    if (!data?.length) {
      setFilteredResult({ data: [], stats: null });
      return;
    }
    
    const result = applyAllFilters(data, filters);
    setFilteredResult(result);
    onDataChange?.(result);
  }, [data, filters, onDataChange]);
  
  const availableFilters = useMemo(() => getAvailableFilters(data), [data]);
  
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);
  
  const resetFilters = useCallback(() => {
    setFilters({
      negocio: 'todos',
      sucursal: 'todos',
      fechaInicio: null,
      fechaFin: null,
      granularidad: 'mensual'
    });
  }, []);
  
  const value = {
    filters,
    filteredData: filteredResult.data,
    stats: filteredResult.stats,
    availableFilters,
    updateFilter,
    resetFilters,
    hasData: filteredResult.data?.length > 0
  };
  
  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterContext() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilterContext must be used within FilterProvider');
  }
  return context;
}