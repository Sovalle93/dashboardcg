"use client";
import { useState, useEffect, useCallback } from "react";

export function useHistorial() {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("historialSubidas");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHistorial(parsed);
      } catch (error) {
        console.error("Error cargando historial:", error);
        setHistorial([]);
      }
    }
  }, []);

  const guardarHistorial = useCallback((nuevoHistorial) => {
    setHistorial(nuevoHistorial);
    localStorage.setItem("historialSubidas", JSON.stringify(nuevoHistorial));
  }, []);

  const agregarRegistro = useCallback((pedidos, archivos) => {
    const nuevoRegistro = {
      id: Date.now(),
      fecha: new Date().toISOString(),
      archivos: Array.isArray(archivos) ? archivos : [archivos],
      totalVentas: pedidos.reduce((s, p) => s + p.monto, 0),
      totalPedidos: pedidos.length,
      fechaInicio: pedidos.length > 0 
        ? new Date(Math.min(...pedidos.map(p => new Date(p.fecha)))) 
        : null,
      fechaFin: pedidos.length > 0 
        ? new Date(Math.max(...pedidos.map(p => new Date(p.fecha)))) 
        : null,
      datos: pedidos
    };
    
    setHistorial(prev => {
      const nuevo = [nuevoRegistro, ...prev];
      localStorage.setItem("historialSubidas", JSON.stringify(nuevo));
      return nuevo;
    });
    
    return nuevoRegistro;
  }, []);

  const eliminarRegistro = useCallback((id, onSuccess) => {
    setHistorial(prev => {
      const nuevoHistorial = prev.filter(r => r.id !== id);
      localStorage.setItem("historialSubidas", JSON.stringify(nuevoHistorial));
      onSuccess?.();
      return nuevoHistorial;
    });
  }, []);

  const eliminarTodos = useCallback((onSuccess) => {
    setHistorial([]);
    localStorage.removeItem("historialSubidas");
    onSuccess?.();
  }, []);

  const obtenerEstadisticas = useCallback(() => {
    return {
      totalRegistros: historial.length,
      totalPedidos: historial.reduce((acc, h) => acc + h.totalPedidos, 0),
      totalVentas: historial.reduce((acc, h) => acc + h.totalVentas, 0),
      ultimoRegistro: historial[0] || null
    };
  }, [historial]);

  return {
    historial,
    cargando,
    setCargando,
    guardarHistorial,
    agregarRegistro,
    eliminarRegistro,
    eliminarTodos,
    obtenerEstadisticas
  };
}