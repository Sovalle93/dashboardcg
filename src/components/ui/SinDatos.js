// components/ui/SinDatos.js
"use client";
import { AlertCircle } from "lucide-react";

export default function SinDatos({ titulo, razon }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      padding: '32px 24px',
      textAlign: 'center',
      border: '1px solid #e8e8e8',
      minHeight: 300,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        background: '#fff8e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16
      }}>
        <AlertCircle size={24} color="#f39c12" />
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: '#333', marginBottom: 8 }}>
        {titulo}
      </h3>
      <p style={{ fontSize: 12, color: '#999', maxWidth: 280, margin: '0 auto', lineHeight: 1.5 }}>
        {razon}
      </p>
    </div>
  );
}