// components/layout/GlobalResumenCards.js - Corregido
"use client";
import { memo } from 'react';
import { DollarSign, ShoppingBag, Store, TrendingUp } from 'lucide-react';
import { useFilterContext } from '@/components/context/filterContext';
import EmptyState from '@/components/ui/EmptyState';  // ← Import correcto

const MetricCard = ({ title, value, icon: Icon, color, prefix = '', suffix = '' }) => (
  <div style={{
    background: '#fff',
    borderRadius: 12,
    padding: '20px 16px',
    border: '1px solid #e8e8e8',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s, box-shadow 0.2s'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)';
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {title}
      </p>
      <div style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        background: `${color}10`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon size={16} color={color} />
      </div>
    </div>
    <p style={{ fontSize: 24, fontWeight: 700, color: '#111', margin: 0 }}>
      {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
    </p>
  </div>
);

export const GlobalResumenCards = memo(() => {
  const { stats, hasData, filters } = useFilterContext();
  
  if (!hasData && stats?.totalPedidos === 0) {
    return (
      <EmptyState 
        title="Sin datos con los filtros actuales"
        description={`No se encontraron pedidos para ${filters.negocio !== 'todos' ? `el negocio "${filters.negocio}" ` : ''}${filters.sucursal !== 'todos' ? `la sucursal "${filters.sucursal}" ` : ''}en el período seleccionado.`}
        icon="alert"
      />
    );
  }
  
  if (!stats) {
    return (
      <EmptyState 
        title="Cargue datos para comenzar"
        description="Suba archivos Excel para ver las métricas de ventas"
        icon="inbox"
      />
    );
  }
  
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: 16,
      marginBottom: 24
    }}>
      <MetricCard
        title="Ventas Totales"
        value={stats.totalVentas}
        icon={DollarSign}
        color="#002b54"
        prefix="$"
      />
      <MetricCard
        title="Total Pedidos"
        value={stats.totalPedidos}
        icon={ShoppingBag}
        color="#2ecc71"
      />
      <MetricCard
        title="Ticket Promedio"
        value={stats.ticketPromedio}
        icon={TrendingUp}
        color="#e67e22"
        prefix="$"
      />
      <MetricCard
        title="Sucursales"
        value={stats.sucursales}
        icon={Store}
        color="#3498db"
      />
    </div>
  );
});

GlobalResumenCards.displayName = 'GlobalResumenCards';