import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req) {
  try {
    const body = await req.json();
    const { totalVentas, totalPedidos, datosMes, datosSucursal } = body;

    if (
      typeof totalVentas !== "number" ||
      typeof totalPedidos !== "number" ||
      !Array.isArray(datosMes) ||
      !Array.isArray(datosSucursal)
    ) {
      return Response.json({ insight: "Datos inválidos." }, { status: 400 });
    }

    if (datosMes.length > 120 || datosSucursal.length > 100) {
      return Response.json({ insight: "Demasiados datos para analizar." }, { status: 400 });
    }

    const prompt = `Eres un analista de ventas experto. Analizá estos datos y escribí 4-5 oraciones con los insights más importantes en español:
- Ventas totales: $${totalVentas.toLocaleString("es-CL")}
- Total pedidos: ${totalPedidos}
- Por mes: ${JSON.stringify(datosMes)}
- Top sucursales: ${JSON.stringify(datosSucursal.slice(0, 5))}
Destacá tendencias, la mejor sucursal y una recomendación concreta.`;

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    });

    return Response.json({ insight: message.content[0].text });
  } catch (err) {
    if (err?.status === 400 && err?.error?.error?.message?.includes("credit balance")) {
      return Response.json({ insight: "⚠️ Sin créditos en la cuenta Anthropic. Cargá saldo en console.anthropic.com → Billing para activar el análisis IA." });
    }
    return Response.json({ insight: "Error al generar el análisis. Verificá tu API key en .env.local." });
  }
}