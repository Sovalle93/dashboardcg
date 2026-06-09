// components/ui/historial/useHistorial.js
"use client";
import { useState, useEffect, useCallback } from "react";

export function useHistorial() {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Cargar historial desde localStorage al iniciar
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

  // Función para generar hash único del archivo (evita duplicados exactos)
  const generarHash = (pedidos, archivos) => {
    const primerPedido = pedidos[0];
    const ultimoPedido = pedidos[pedidos.length - 1];
    const fechaInicio = primerPedido?.fecha || '';
    const fechaFin = ultimoPedido?.fecha || '';
    const totalVentas = pedidos.reduce((s, p) => s + (p.monto || 0), 0);
    const totalPedidos = pedidos.length;
    
    // Hash simple basado en características únicas
    return `${archivos.join(',')}|${fechaInicio}|${fechaFin}|${totalVentas}|${totalPedidos}`;
  };

  // Verificar si ya existe un registro similar
  const existeRegistro = useCallback((nuevosPedidos, archivos) => {
    const nuevoHash = generarHash(nuevosPedidos, archivos);
    
    return historial.some(registro => {
      const registroHash = generarHash(registro.datos, registro.archivos);
      return registroHash === nuevoHash;
    });
  }, [historial]);

  // Agregar nuevo registro (evitando duplicados)
  const agregarRegistro = useCallback((pedidos, archivos) => {
    if (!pedidos || pedidos.length === 0) {
      console.warn("No hay datos para guardar en historial");
      return null;
    }
    
    // Verificar si ya existe
    if (existeRegistro(pedidos, archivos)) {
      console.log("Registro ya existe en historial, no se duplica");
      return null;
    }
    
    const nuevoRegistro = {
      id: Date.now(),
      fecha: new Date().toISOString(),
      archivos: Array.isArray(archivos) ? archivos : [archivos],
      totalVentas: pedidos.reduce((s, p) => s + (p.monto || 0), 0),
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
  }, [existeRegistro]);

  // Eliminar registro individual
  const eliminarRegistro = useCallback((id) => {
    setHistorial(prev => {
      const nuevoHistorial = prev.filter(r => r.id !== id);
      localStorage.setItem("historialSubidas", JSON.stringify(nuevoHistorial));
      return nuevoHistorial;
    });
  }, []);

  // Eliminar todos los registros
  const eliminarTodos = useCallback(() => {
    if (confirm("⚠️ ¿Eliminar TODO el historial?\n\nEsta acción eliminará todos los registros permanentemente.")) {
      setHistorial([]);
      localStorage.removeItem("historialSubidas");
    }
  }, []);

  // Limpiar historial (sin confirmación, para reset)
  const limpiarHistorial = useCallback(() => {
    setHistorial([]);
    localStorage.removeItem("historialSubidas");
  }, []);

  // Obtener estadísticas
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
    agregarRegistro,
    eliminarRegistro,
    eliminarTodos,
    limpiarHistorial,
    obtenerEstadisticas
  };
}