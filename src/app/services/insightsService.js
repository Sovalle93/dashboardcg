// app/services/insightsService.js
import { getAIService } from './aiService.js';
import { DataValidator } from '../utils/validators.js';

class InsightsService {
  constructor() {
    this.aiService = getAIService();
  }

  async generateBusinessInsight(rawData) {
    const validation = DataValidator.validateVentasData(rawData);
    if (!validation.isValid) {
      throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
    }

    const { totalVentas, totalPedidos, datosMes, datosSucursal } = validation.sanitizedData;
    const ticketPromedio = totalPedidos > 0 ? (totalVentas / totalPedidos).toFixed(2) : 0;

    // datosSucursal is an array of {sucursal, total, cantidad}
    let mejorSucursal = "";
    let peorSucursal = "";
    if (Array.isArray(datosSucursal) && datosSucursal.length > 0) {
      const sorted = [...datosSucursal].sort((a, b) => b.total - a.total);
      mejorSucursal = `${sorted[0].sucursal} ($${sorted[0].total.toLocaleString()})`;
      if (sorted.length > 1) {
        const last = sorted[sorted.length - 1];
        peorSucursal = `${last.sucursal} ($${last.total.toLocaleString()})`;
      }
    }

    // Trend from last two months
    let tendencia = "";
    if (Array.isArray(datosMes) && datosMes.length >= 2) {
      const ultimoMes = datosMes[datosMes.length - 1]?.total || 0;
      const mesAnterior = datosMes[datosMes.length - 2]?.total || 0;
      const pct = mesAnterior > 0 ? ((ultimoMes - mesAnterior) / mesAnterior * 100).toFixed(1) : 0;
      tendencia = pct > 0 ? `↑ ${pct}%` : `↓ ${Math.abs(pct)}%`;
    }

    const prompt = `
Analiza los siguientes datos de ventas y genera un análisis PROFESIONAL y ACCIONABLE:

📊 MÉTRICAS CLAVE:
- Ventas totales: $${totalVentas.toLocaleString()}
- Total pedidos: ${totalPedidos}
- Ticket promedio: $${ticketPromedio}
- Tendencia mensual: ${tendencia || "No disponible"}

🏢 RENDIMIENTO POR SUCURSAL:
${mejorSucursal ? `- Mejor sucursal: ${mejorSucursal}` : "No disponible"}
${peorSucursal ? `- Sucursal con oportunidad: ${peorSucursal}` : ""}

📈 DATOS MENSUALES:
${JSON.stringify(datosMes, null, 2)}

🏪 DATOS POR SUCURSAL (top 5):
${JSON.stringify(Array.isArray(datosSucursal) ? datosSucursal.slice(0, 5) : [], null, 2)}

INSTRUCCIONES:
1. Identifica los 3 insights más importantes
2. Da 3 recomendaciones específicas y accionables
3. Señala oportunidades de mejora
4. Formato profesional en español, máximo 200 palabras

Estructura:
**📈 PANORAMA GENERAL:** [resumen ejecutivo]
**🎯 RECOMENDACIONES:** 1. ... 2. ... 3. ...
**⚠️ PUNTOS DE ATENCIÓN:** - ...
    `;

    const { insight, model } = await this.aiService.generateInsight(prompt);

    return {
      insight,
      metadata: {
        generatedAt: new Date().toISOString(),
        model: model || 'groq',
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

export function createInsightsService() {
  return new InsightsService();
}
