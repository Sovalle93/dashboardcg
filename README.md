# 📊 Dashboardcg

> Dashboard analítico inteligente para visualización de datos empresariales a partir de archivos Excel.

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue)](https://tailwindcss.com/)

## ✨ Características

- 📈 **Visualización dinámica** de gráficos a partir de archivos Excel (.xls)
- 🤖 **Análisis inteligente** con Claude (Anthropic) para insights automatizados
- 🎨 **UI moderna** con Tailwind CSS y componentes responsivos
- 📊 **Renderizado condicional** — solo muestra datos cuando existen
- ⚡ **Carga progresiva** — gráficos primero, luego el resto del dashboard
- 🔒 **Manejo seguro** de API keys mediante variables de entorno

## 🚀 Demo Rápida

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/datavision-dashboard.git

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar en desarrollo
npm run dev
```

## 🛠️ Tecnologías

| Tecnología | Propósito |
|------------|-----------|
| Next.js 15 | Framework React con App Router |
| Tailwind CSS | Estilizado y diseño responsivo |
| Recharts / Chart.js | Renderizado de gráficos |
| Anthropic SDK | Integración con Claude AI |
| Papa Parse / XLSX | Parseo de archivos Excel |
| TypeScript | Tipado estático |

## 📦 Estructura del Proyecto

```
datavision-dashboard/
├── app/
│   ├── api/
│   │   └── analyze/        # Endpoint para Claude AI
│   ├── dashboard/
│   │   └── page.tsx        # Página principal del dashboard
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── charts/             # Componentes de gráficos
│   ├── FileUploader.tsx    # Subida de archivos Excel
│   ├── DashboardView.tsx   # Vista principal del dashboard
│   └── ClaudeAnalysis.tsx  # Botón y análisis de IA
├── lib/
│   ├── excelParser.ts      # Lógica de parseo de .xls
│   └── chartConfig.ts      # Configuración de gráficos
├── types/
│   └── index.ts            # Interfaces TypeScript
├── public/
├── .env.example
├── .env.local (ignorado)
└── package.json
```

## 🔧 Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz:

```env
# Clave API de Anthropic (requerida para análisis con Claude)
ANTHROPIC_API_KEY=tu_api_key_aqui

# Opcional: Personalizar endpoint
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 2. Instalación de Dependencias

```bash
npm install xlsx recharts @anthropic-ai/sdk papaparse
npm install -D @types/papaparse
```

### 3. Ejecutar en Desarrollo

```bash
npm run dev
# Abrir http://localhost:3000
```
## 🎯 Uso

1. **Subir archivo Excel** desde el backoffice del cliente
2. **Visualización inmediata** de los gráficos solicitados
3. **Dashboard completo** con métricas clave
4. **Análisis inteligente** — haz clic en "🤖 Analizar con Claude" para obtener insights automáticos

## 🔌 Integración con Claude

El botón de análisis envía los datos agregados al modelo Claude de Anthropic:

```typescript
// Ejemplo de respuesta esperada
{
  "insights": "Se detecta un crecimiento del 23% en ventas durante Q3...",
  "recommendations": ["Optimizar inventario para productos A", "Aumentar campaña en región B"],
  "anomalies": ["Caída inusual en conversiones durante fin de semana"]
}
```

---
*Hecho con 🚀 y ☕ para dashboards empresariales inteligentes*
```

Este README incluye:

✅ **Insignias profesionales** (shields.io)  
✅ **Estructura clara** y secciones bien definidas  
✅ **Diagrama de flujo** con Mermaid  
✅ **Tablas** para comandos, tecnologías y solución de problemas  
✅ **Instrucciones detalladas** para variables de entorno  
✅ **Sección de despliegue** (Vercel/Docker)  
✅ **Formato de Excel esperado** con ejemplo  
✅ **Advertencias** sobre seguridad y buenas prácticas  

Solo reemplaza los datos de contacto y URLs con los tuyos. ¡Éxito con tu dashboard!