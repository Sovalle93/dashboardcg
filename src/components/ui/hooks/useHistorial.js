// src/components/ui/historial/useHistorial.js - VERSIÓN SIMPLE Y FUNCIONAL
"use client";
import { useState, useEffect, useCallback } from "react";

// Límites para prevenir colapso
const MAX_REGISTROS = 15;
const MAX_TAMANO_BYTES = 4.5 * 1024 * 1024; // 4.5MB

export function useHistorial() {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Verificar tamaño del localStorage
  const verificarTamano = useCallback(() => {
    try {
      let total = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        total += (key?.length || 0) + (value?.length || 0);
      }
      const porcentaje = (total / MAX_TAMANO_BYTES) * 100;
      if (porcentaje > 80) {
        console.warn(`⚠️ Storage al ${porcentaje.toFixed(1)}% de capacidad`);
      }
      return { total, porcentaje };
    } catch (e) {
      return { total: 0, porcentaje: 0 };
    }
  }, []);

  // Cargar historial desde localStorage
  const cargarHistorial = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const saved = localStorage.getItem("historialSubidas");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setHistorial(parsed);
        } else {
          localStorage.removeItem("historialSubidas");
          setHistorial([]);
        }
      } else {
        setHistorial([]);
      }
    } catch (err) {
      console.error("Error cargando historial:", err);
      setError("Error al cargar el historial. Se ha limpiado para corregirlo.");
      localStorage.removeItem("historialSubidas");
      setHistorial([]);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarHistorial();
  }, [cargarHistorial]);

  // Guardar historial con validaciones
  const guardarHistorial = useCallback((nuevoHistorial) => {
    try {
      const serializado = JSON.stringify(nuevoHistorial);
      const tamañoBytes = new Blob([serializado]).size;
      
      if (tamañoBytes > MAX_TAMANO_BYTES) {
        throw new Error(`Historial demasiado grande (${(tamañoBytes / 1024 / 1024).toFixed(2)}MB). Elimina registros antiguos.`);
      }
      
      localStorage.setItem("historialSubidas", serializado);
      verificarTamano();
      return true;
    } catch (err) {
      if (err.name === "QuotaExceededError") {
        setError("El historial está lleno. Elimina registros antiguos.");
      } else {
        setError(err.message);
      }
      return false;
    }
  }, [verificarTamano]);

  // Agregar nuevo registro (SOLO METADATOS, no datos completos)
  const agregarRegistro = useCallback((pedidos, archivos) => {
    if (!pedidos || pedidos.length === 0) {
      setError("No hay datos para guardar");
      return null;
    }

    const totalVentas = pedidos.reduce((s, p) => s + (p.monto || 0), 0);
    const totalPedidos = pedidos.length;
    
    const fechas = pedidos.map(p => new Date(p.fecha)).filter(d => !isNaN(d));
    
    const nuevoRegistro = {
      id: Date.now(),
      fecha: new Date().toISOString(),
      archivos: Array.isArray(archivos) ? archivos : [archivos],
      totalVentas,
      totalPedidos,
      fechaInicio: fechas.length ? new Date(Math.min(...fechas)).toISOString() : null,
      fechaFin: fechas.length ? new Date(Math.max(...fechas)).toISOString() : null,
      // ⚠️ NO guardamos los datos completos de pedidos
    };
    
    setHistorial(prev => {
      // Limitar a MAX_REGISTROS registros
      const nuevo = [nuevoRegistro, ...prev].slice(0, MAX_REGISTROS);
      guardarHistorial(nuevo);
      return nuevo;
    });
    
    return nuevoRegistro;
  }, [guardarHistorial]);

  // Eliminar registro individual
  const eliminarRegistro = useCallback((id) => {
    setHistorial(prev => {
      const nuevo = prev.filter(r => r.id !== id);
      guardarHistorial(nuevo);
      return nuevo;
    });
  }, [guardarHistorial]);

  // Eliminar todos los registros — la confirmación la maneja quien llama esto
  const eliminarTodos = useCallback(() => {
    setHistorial([]);
    localStorage.removeItem("historialSubidas");
    setError(null);
  }, []);

  // Obtener estadísticas
  const obtenerEstadisticas = useCallback(() => {
    const tamano = verificarTamano();
    return {
      totalRegistros: historial.length,
      totalPedidos: historial.reduce((acc, h) => acc + h.totalPedidos, 0),
      totalVentas: historial.reduce((acc, h) => acc + h.totalVentas, 0),
      ultimoRegistro: historial[0] || null,
      storageUsage: tamano.porcentaje.toFixed(1)
    };
  }, [historial, verificarTamano]);

  return {
    historial,
    cargando,
    error,
    agregarRegistro,
    eliminarRegistro,
    eliminarTodos,
    obtenerEstadisticas,
    recargar: cargarHistorial
  };
}