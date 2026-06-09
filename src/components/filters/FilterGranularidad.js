// components/filters/FilterGranularidad.jsx
"use client";
import { memo } from 'react';
import { TrendingUp } from 'lucide-react';

const GRANULARIDAD_OPTIONS = [
  { value: 'diario', label: '📅 Diario', icon: '📅' },
  { value: 'mensual', label: '📆 Mensual', icon: '📆' },
  { value: 'anual', label: '📊 Anual', icon: '📊' }
];

export const FilterGranularidad = memo(({ value, onChange }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 130 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        <TrendingUp size={12} style={{ marginRight: 6, display: 'inline' }} />
        Granularidad
      </label>
      <div style={{ display: 'flex', gap: 6 }}>
        {GRANULARIDAD_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              flex: 1,
              padding: '8px 8px',
              fontSize: 12,
              background: value === opt.value ? '#002b54' : '#fff',
              color: value === opt.value ? '#fff' : '#666',
              border: `1px solid ${value === opt.value ? '#002b54' : '#e0e0e0'}`,
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontWeight: value === opt.value ? 600 : 400
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
});

FilterGranularidad.displayName = 'FilterGranularidad';