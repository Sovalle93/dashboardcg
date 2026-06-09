// components/filters/FilterSelect.jsx
"use client";
import { memo } from 'react';

export const FilterSelect = memo(({ 
  label, 
  value, 
  options, 
  onChange, 
  placeholder = 'Seleccionar...',
  icon = null 
}) => {
  const id = `filter-${label.toLowerCase().replace(/\s/g, '-')}`;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 160 }}>
      <label 
        htmlFor={id}
        style={{ fontSize: 11, fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}
      >
        {icon && <span style={{ marginRight: 6 }}>{icon}</span>}
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: '10px 12px',
          border: '1px solid #e0e0e0',
          borderRadius: 8,
          fontSize: 13,
          background: '#fff',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onFocus={(e) => e.target.style.borderColor = '#002b54'}
        onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
      >
        {options.map(opt => (
          <option key={opt} value={opt}>
            {opt === 'todos' ? '📊 Todos' : opt}
          </option>
        ))}
      </select>
    </div>
  );
});

FilterSelect.displayName = 'FilterSelect';