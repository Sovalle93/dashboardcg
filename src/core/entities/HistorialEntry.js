// core/entities/HistorialEntry.js
/**
 * Entidad - contiene las reglas de negocio
 * Single Responsibility: solo maneja la lógica de un registro de historial
 */
export class HistorialEntry {
  constructor({ id, fecha, archivos, totalVentas, totalPedidos, fechaInicio, fechaFin }) {
    this.id = id || Date.now();
    this.fecha = fecha || new Date().toISOString();
    this.archivos = Array.isArray(archivos) ? archivos : [archivos];
    this.totalVentas = totalVentas || 0;
    this.totalPedidos = totalPedidos || 0;
    this.fechaInicio = fechaInicio || null;
    this.fechaFin = fechaFin || null;
  }

  // Reglas de negocio encapsuladas
  isValid() {
    return this.archivos.length > 0 && this.totalPedidos > 0;
  }

  getResumen() {
    return {
      archivos: this.archivos.join(", "),
      ventas: this.totalVentas,
      pedidos: this.totalPedidos,
      ticketPromedio: this.totalPedidos > 0 ? this.totalVentas / this.totalPedidos : 0
    };
  }

  // Liskov Substitution: método estándar para serialización
  toJSON() {
    return {
      id: this.id,
      fecha: this.fecha,
      archivos: this.archivos,
      totalVentas: this.totalVentas,
      totalPedidos: this.totalPedidos,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin
    };
  }

  static fromJSON(data) {
    return new HistorialEntry(data);
  }
}