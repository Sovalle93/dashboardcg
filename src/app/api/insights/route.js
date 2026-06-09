import { createInsightsService } from '../../services/insightsService.js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const startTime = Date.now();

  try {
    const body = await request.json();

    const { totalVentas, totalPedidos, datosMes, datosSucursal } = body ?? {};

    if (
      typeof totalVentas !== 'number' ||
      typeof totalPedidos !== 'number' ||
      !Array.isArray(datosMes) ||
      !Array.isArray(datosSucursal)
    ) {
      return NextResponse.json(
        { success: false, insight: null, error: 'Datos inválidos o incompletos.' },
        { status: 400 }
      );
    }

    if (datosMes.length > 120 || datosSucursal.length > 100) {
      return NextResponse.json(
        { success: false, insight: null, error: 'Demasiados datos para analizar.' },
        { status: 400 }
      );
    }

    const insightsService = createInsightsService();
    const result = await insightsService.generateBusinessInsight({
      totalVentas,
      totalPedidos,
      datosMes,
      datosSucursal
    });

    return NextResponse.json({
      success: true,
      ...result,
      performance: { durationMs: Date.now() - startTime }
    });

  } catch (error) {
    console.error('Error en /api/insights:', error.message);
    return NextResponse.json(
      { success: false, insight: null, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'healthy', service: 'insights-api' });
}
