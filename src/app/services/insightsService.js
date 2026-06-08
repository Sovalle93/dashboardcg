// app/services/insightsService.js
import { getAIService } from './aiService.js';
import { DataValidator } from '../utils/validators.js';

class InsightsService {
  constructor() {
    this.aiService = getAIService();
  }
  
  async generateBusinessInsight(rawData) {
    // 1. Validar datos
    const validation = DataValidator.validateVentasData(rawData);
    if (!validation.isValid) {
      throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
    }
    
    const { totalVentas, totalPedidos, datosMes, datosSucursal } = validation.sanitizedData;
    const ticketPromedio = totalPedidos > 0 ? (totalVentas / totalPedidos).toFixed(2) : 0;
    
    // 2. Calcular tendencias adicionales (más datos = mejor análisis)
    let tendencia = "";
    let mejorSucursal = "";
    let peorSucursal = "";
    
    if (datosSucursal && typeof datosSucursal === 'object') {
      const sucursales = Object.entries(datosSucursal);
      if (sucursales.length > 0) {
        const mejor = sucursales.reduce((a, b) => a[1] > b[1] ? a : b);
        const peor = sucursales.reduce((a, b) => a[1] < b[1] ? a : b);
        mejorSucursal = `${mejor[0]} (${mejor[1]} ventas)`;
        peorSucursal = `${peor[0]} (${peor[1]} ventas)`;
      }
    }
    
    if (datosMes && Array.isArray(datosMes) && datosMes.length >= 2) {
      const ultimoMes = datosMes[datosMes.length - 1]?.total || 0;
      const mesAnterior = datosMes[datosMes.length - 2]?.total || 0;
      const porcentaje = mesAnterior > 0 ? ((ultimoMes - mesAnterior) / mesAnterior * 100).toFixed(1) : 0;
      tendencia = porcentaje > 0 ? `↑ ${porcentaje}%` : `↓ ${Math.abs(porcentaje)}%`;
    }
    
    // 3. Construir prompt ENRIQUECIDO para mejor análisis
    const prompt = `
      Analiza los siguientes datos de ventas y genera un análisis PROFESIONAL y ACCIONABLE:
      
      📊 **MÉTRICAS CLAVE:**
      - Ventas totales: $${totalVentas.toLocaleString()}
      - Total pedidos: ${totalPedidos}
      - Ticket promedio: $${ticketPromedio}
      - Tendencia mensual: ${tendencia || "No disponible"}
      
      🏢 **RENDIMIENTO POR SUCURSAL:**
      ${mejorSucursal ? `- Mejor sucursal: ${mejorSucursal}` : "No disponible"}
      ${peorSucursal ? `- Sucursal con oportunidad: ${peorSucursal}` : ""}
      
      📈 **DATOS MENSUALES DETALLADOS:**
      ${JSON.stringify(datosMes, null, 2)}
      
      🏪 **DATOS POR SUCURSAL:**
      ${JSON.stringify(datosSucursal, null, 2)}
      
    **INSTRUCCIONES PARA EL ANÁLISIS:**
    1. Identifica los 3 insights más importantes
    2. Da 3 recomendaciones específicas y accionables
    3. Señala oportunidades claras de mejora
    4. Menciona riesgos si los hay
    5. Formato profesional, claro y en español
    6. Máximo 200 palabras (sé conciso pero completo)
    
    IMPORTANTE: NO agregues texto extra al final. Termina naturalmente con las recomendaciones.
      
      Estructura tu respuesta así:
      **📈 PANORAMA GENERAL:**
      [resumen ejecutivo]
      
      **🎯 RECOMENDACIONES PRIORITARIAS:**
      1. [recomendación específica]
      2. [recomendación específica]
      3. [recomendación específica]
      
      **⚠️ PUNTOS DE ATENCIÓN:**
      - [riesgo u oportunidad identificada]
    `;
    
    // 4. Generar insight con Groq
    const insight = await this.aiService.generateInsight(prompt);
    
    // 5. Retornar respuesta enriquecida
    return {
      insight,
      metadata: {
        generatedAt: new Date().toISOString(),
        model: this.aiService.model,
        provider: 'groq',
        metrics: {
          ticketPromedio: parseFloat(ticketPromedio),
          totalVentas,
          totalPedidos,
          tendencia
        }
      }
    };
  }
}

// Factory pattern
export function createInsightsService() {
  return new InsightsService();
}