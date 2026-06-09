// components/ui/EmptyState.js
"use client";
import { AlertCircle, UploadCloud, Inbox } from "lucide-react";

export default function EmptyState({ 
  title = "No hay datos disponibles", 
  description = "Intente con otros filtros o cargue nuevos archivos",
  icon = "alert",
  actionText = null,
  onAction = null
}) {
  const IconComponent = icon === 'upload' ? UploadCloud : icon === 'inbox' ? Inbox : AlertCircle;
  
  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      padding: '48px 24px',
      textAlign: 'center',
      border: '1px solid #e8e8e8',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
    }}>
      <div style={{
        width: 64,
        height: 64,
        borderRadius: 16,
        background: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px'
      }}>
        <IconComponent size={32} color="#999" />
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: '#333', marginBottom: 10 }}>
        {title}
      </h3>
      <p style={{ fontSize: 14, color: '#888', maxWidth: 380, margin: '0 auto', lineHeight: 1.5 }}>
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          style={{
            marginTop: 24,
            padding: '10px 24px',
            background: '#002b54',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 500
          }}
        >
          {actionText}
        </button>
      )}
    </div>
  );
}