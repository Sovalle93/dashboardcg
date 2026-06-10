// context/FilterContext.jsx
"use client";
import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { applyAllFilters, getAvailableFilters } from '@/components/utils/filterUtils';
import { getTheme } from '@/lib/theme';

const FilterContext = createContext(null);

export function FilterProvider({ children, data, onDataChange }) {
  const [filters, setFilters] = useState({
    negocio: 'todos',
    sucursal: 'todos',
    tipo: 'todos',
    fechaInicio: null,
    fechaFin: null,
    granularidad: 'mensual'
  });

  // useMemo is synchronous — no empty-data flash between renders when filters change.
  const filteredResult = useMemo(() => {
    if (!data?.length) return { data: [], stats: null };
    return applyAllFilters(data, filters);
  }, [data, filters]);

  // Side-effect callback for external consumers (optional prop).
  useEffect(() => {
    onDataChange?.(filteredResult);
  }, [filteredResult, onDataChange]);

  const availableFilters = useMemo(() => {
    const base = getAvailableFilters(data ?? []);
    if (!filters.negocio || filters.negocio === 'todos') return base;
    const negocioData = (data ?? []).filter(p => p.negocio === filters.negocio);
    const sucursales = ['todos', ...new Set(negocioData.map(p => p.sucursal).filter(Boolean))];
    return { ...base, sucursales };
  }, [data, filters.negocio]);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => {
      const next = { ...prev, [key]: value };
      if (key === 'negocio') next.sucursal = 'todos';
      return next;
    });
  }, []);
  
  const resetFilters = useCallback(() => {
    setFilters({
      negocio: 'todos',
      sucursal: 'todos',
      tipo: 'todos',
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
    theme: getTheme(filters.negocio),   // null when 'todos', brand object when specific negocio
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