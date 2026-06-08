// app/constants/prompts.js
export const INSIGHT_PROMPTS = {
  SYSTEM_CONTEXT: "Eres un experto analista de negocios especializado en retail y ventas.",
  
  BASE_TEMPLATE: (data) => `
    Analiza los siguientes datos de ventas y genera un insight profesional:
    
    📊 MÉTRICAS PRINCIPALES:
    - Ventas totales: $${data.totalVentas?.toLocaleString() || 0}
    - Total pedidos: ${data.totalPedidos || 0}
    - Ticket promedio: $${((data.totalVentas || 0) / (data.totalPedidos || 1)).toFixed(2)}
    
    📈 DATOS MENSUALES:
    ${JSON.stringify(data.datosMes, null, 2)}
    
    🏢 DATOS POR SUCURSAL:
    ${JSON.stringify(data.datosSucursal, null, 2)}
    
    Instrucciones:
    1. Identifica tendencias clave (positivas/negativas)
    2. Da 2-3 recomendaciones accionables
    3. Señala 1 oportunidad de mejora específica
    4. Usa lenguaje profesional pero claro
    5. Responde en español
    6. Máximo 150 palabras
  `
};