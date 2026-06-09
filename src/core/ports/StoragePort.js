// core/ports/StoragePort.js
/**
 * Puerto de almacenamiento - abstracción para cualquier tipo de storage
 * Siguiendo Interface Segregation: solo métodos necesarios
 */
export class StoragePort {
  async getItem(key) { throw new Error("Not implemented"); }
  async setItem(key, value) { throw new Error("Not implemented"); }
  async removeItem(key) { throw new Error("Not implemented"); }
  getQuotaInfo() { return { used: 0, limit: 0, percentage: 0 }; }
  isAvailable() { return true; }
}