// components/filters/FilterBar.jsx
"use client";
import { memo } from 'react';
import { Filter, RotateCcw, AlertCircle } from 'lucide-react';
import { FilterSelect } from './FilterSelect';
import { FilterDatePicker } from './FilterDatePicker';
import { FilterGranularidad } from './FilterGranularidad';
import { useFilterContext } from '@/components/context/filterContext';

export const FilterBar = memo(() => {
  const {
    filters,
    updateFilter,
    resetFilters,
    availableFilters,
    hasData,
    stats,
    theme
  } = useFilterContext();
  
  if (!availableFilters.negocios?.length && !availableFilters.sucursales?.length) {
    return null;
  }
  
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e8e8e8',
      borderRadius: 12,
      padding: '20px 24px',
      marginBottom: 24,
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Filter size={16} color="#002b54" />
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111', margin: 0 }}>
            Filtros de análisis
          </h3>
          {!hasData && stats?.totalPedidos === 0 && (
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: '#fff3e0',
              padding: '4px 8px',
              borderRadius: 20,
              fontSize: 11,
              color: '#e67e22'
            }}>
              <AlertCircle size={12} />
              Sin datos con filtros actuales
            </span>
          )}
        </div>
        <button
          onClick={resetFilters}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            fontSize: 12,
            background: 'transparent',
            border: '1px solid #e0e0e0',
            borderRadius: 8,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f5f5f5';
            e.currentTarget.style.borderColor = '#002b54';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = '#e0e0e0';
          }}
        >
          <RotateCcw size={12} />
          Resetear filtros
        </button>
      </div>
      
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        alignItems: 'flex-end'
      }}>
        <FilterSelect
          label="Negocio"
          value={filters.negocio}
          options={availableFilters.negocios || ['todos']}
          onChange={(val) => updateFilter('negocio', val)}
          icon="🏢"
        />
        
        <FilterSelect
          label="Sucursal"
          value={filters.sucursal}
          options={availableFilters.sucursales || ['todos']}
          onChange={(val) => updateFilter('sucursal', val)}
          icon="📍"
        />

        <FilterSelect
          label="Tipo"
          value={filters.tipo}
          options={availableFilters.tipos || ['todos']}
          onChange={(val) => updateFilter('tipo', val)}
          icon="🎯"
        />

        <FilterDatePicker
          label="Desde"
          value={filters.fechaInicio}
          onChange={(val) => updateFilter('fechaInicio', val)}
          maxDate={availableFilters.dateRange?.max}
          minDate={availableFilters.dateRange?.min}
        />
        
        <FilterDatePicker
          label="Hasta"
          value={filters.fechaFin}
          onChange={(val) => updateFilter('fechaFin', val)}
          maxDate={availableFilters.dateRange?.max}
          minDate={availableFilters.dateRange?.min}
        />
        
        <FilterGranularidad
          value={filters.granularidad}
          onChange={(val) => updateFilter('granularidad', val)}
          theme={theme}
        />
      </div>
      
      {/* Indicador de datos filtrados */}
      {stats && (
        <div style={{
          marginTop: 16,
          paddingTop: 12,
          borderTop: '1px solid #f0f0f0',
          fontSize: 12,
          color: '#666',
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap'
        }}>
          <span>📊 Mostrando {stats.totalPedidos} pedidos</span>
          <span>💰 ${stats.totalVentas.toLocaleString()}</span>
          {stats.ticketPromedio > 0 && (
            <span>🎫 Ticket promedio: ${stats.ticketPromedio.toLocaleString()}</span>
          )}
        </div>
      )}
    </div>
  );
});

FilterBar.displayName = 'FilterBar';