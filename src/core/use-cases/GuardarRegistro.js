// core/use-cases/GuardarRegistro.js
import { HistorialEntry } from "@/core/entities/HistorialEntry";

/**
 * Caso de uso - encapsula la lógica de guardar un registro
 * Single Responsibility: solo esta operación
 */
export class GuardarRegistroUseCase {
  constructor(historialRepository) {
    this.repository = historialRepository;
  }

  async execute(pedidos, archivos) {
    // Validaciones
    if (!pedidos || pedidos.length === 0) {
      throw new Error("No hay datos para guardar");
    }
    
    if (!archivos || archivos.length === 0) {
      throw new Error("No se especificaron archivos");
    }
    
    // Calcular métricas
    const totalVentas = pedidos.reduce((sum, p) => sum + (p.monto || 0), 0);
    const totalPedidos = pedidos.length;
    const fechas = pedidos.map(p => new Date(p.fecha)).filter(d => !isNaN(d));
    
    // Crear entidad
    const entry = new HistorialEntry({
      archivos,
      totalVentas,
      totalPedidos,
      fechaInicio: fechas.length ? new Date(Math.min(...fechas)) : null,
      fechaFin: fechas.length ? new Date(Math.max(...fechas)) : null
    });
    
    // Guardar
    return await this.repository.save(entry);
  }
}