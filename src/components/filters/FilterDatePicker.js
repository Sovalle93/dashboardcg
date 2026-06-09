// components/filters/FilterDatePicker.jsx
"use client";
import { memo } from 'react';
import { Calendar } from 'lucide-react';

export const FilterDatePicker = memo(({ 
  label, 
  value, 
  onChange, 
  maxDate = null,
  minDate = null
}) => {
  const id = `filter-date-${label.toLowerCase().replace(/\s/g, '-')}`;
  
  const handleChange = (e) => {
    const newValue = e.target.value ? new Date(e.target.value) : null;
    onChange(newValue);
  };
  
  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 160 }}>
      <label 
        htmlFor={id}
        style={{ fontSize: 11, fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}
      >
        <Calendar size={12} style={{ marginRight: 6, display: 'inline' }} />
        {label}
      </label>
      <input
        id={id}
        type="date"
        value={formatDateForInput(value)}
        onChange={handleChange}
        max={maxDate ? formatDateForInput(maxDate) : undefined}
        min={minDate ? formatDateForInput(minDate) : undefined}
        style={{
          padding: '10px 12px',
          border: '1px solid #e0e0e0',
          borderRadius: 8,
          fontSize: 13,
          background: '#fff',
          cursor: 'pointer',
          fontFamily: 'inherit'
        }}
      />
    </div>
  );
});

FilterDatePicker.displayName = 'FilterDatePicker';