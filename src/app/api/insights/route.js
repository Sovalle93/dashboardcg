// app/api/insights/route.js
import { createInsightsService } from '../../services/insightsService.js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    
    // Validación rápida
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Cuerpo de request inválido' },
        { status: 400 }
      );
    }
    
    const insightsService = createInsightsService();
    const result = await insightsService.generateBusinessInsight({
      totalVentas: body.totalVentas,
      totalPedidos: body.totalPedidos,
      datosMes: body.datosMes,
      datosSucursal: body.datosSucursal
    });
    
    const duration = Date.now() - startTime;
    console.log(`✅ Insight generado exitosamente en ${duration}ms`);
    
    return NextResponse.json({ 
      success: true,
      ...result,
      performance: { durationMs: duration }
    });
    
  } catch (error) {
    console.error('❌ Error en endpoint:', error);
    
    return NextResponse.json(
      { 
        success: false,
        insight: null,
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({ 
    status: 'healthy', 
    service: 'insights-api-groq',
    timestamp: new Date().toISOString()
  });
}