# dashboardcg — Project Onboarding for AI

## What this project is

A **Next.js 16 sales analytics dashboard** built for Cerogrado (a Chilean trampoline park chain). Users upload Excel files exported from their POS system. The app parses them client-side, runs aggregations, and renders interactive charts. A Groq AI endpoint generates a natural-language business insights summary on demand.

**No database. No auth. Fully client-side data processing.**

---

## Tech stack

| Concern | Library / Version |
|---|---|
| Framework | Next.js 16 App Router (React 19) |
| Charts | Recharts 3 |
| Icons | lucide-react |
| Excel parsing | xlsx (client-side, FileReader API) |
| AI backend | Groq SDK — llama-3.3-70b-versatile (with fallback) |
| Fonts | Google Fonts — Montserrat via `next/font` |
| Styling | Inline styles + global `.card` / `.btn-primary` / `.grid-2` CSS classes |
| Locale | `es-CL` throughout (Chilean Spanish, CLP currency) |

**No Tailwind in use despite being in devDependencies. No CSS modules. All styling is inline.**

---

## Folder structure

```
src/
├── app/
│   ├── page.js                  ← Entry point, all routing lives here
│   ├── layout.js                ← Root layout, Montserrat font, es lang
│   ├── globals.css              ← Global classes: .card, .btn-primary, .grid-2
│   ├── api/
│   │   └── insights/route.js    ← POST /api/insights — Groq AI insights
│   ├── services/
│   │   ├── aiService.js         ← Groq SDK wrapper with model fallback
│   │   └── insightsService.js   ← Prompt builder, calls aiService
│   └── utils/
│       └── validators.js        ← Input sanitization for the API route
├── components/
│   ├── charts/
│   │   ├── VentasHistoricas.js       ← Line chart: monthly sales multi-year
│   │   ├── VentasHistoricasTabla.js  ← Comparison table: current vs prior year
│   │   ├── VentasAnualesTotal.js     ← Bar chart: one bar per year (granularidad=anual)
│   │   ├── VentasAnualesComparativo.js ← Multi-year bar chart per month
│   │   ├── EvolucionDiaria.js        ← Line chart: daily sales (granularidad=diario)
│   │   ├── GraficoNegocios.js        ← Bar chart: sales by negocio (Cell per-bar color)
│   │   ├── GraficoSucursales.js      ← Bar chart: sales by sucursal
│   │   ├── RankingLocales.js         ← Ranked list with medal icons
│   │   ├── CrecimientoVsAnterior.js  ← YoY growth per sucursal
│   │   └── TicketPromedio.js         ← Average ticket by negocio and tipo
│   ├── context/
│   │   └── filterContext.js     ← React Context: filteredData, filters, updateFilter
│   ├── filters/
│   │   ├── FilterBar.js         ← Filter controls bar (negocio, sucursal, dates, granularidad)
│   │   ├── FilterSelect.js      ← Reusable select dropdown
│   │   ├── FilterDatePicker.js  ← Date input for date range
│   │   └── FilterGranularidad.js ← Toggle: diario / mensual / anual
│   ├── layout/
│   │   ├── AppHeader.js         ← Cerogrado branding + current date header
│   │   └── GlobalResumenCards.js ← 4-metric summary cards (reads from FilterContext)
│   ├── ui/
│   │   ├── MonthToggle.js       ← Month filter buttons (ENE–DIC), exports MESES array
│   │   ├── InsightIA.js         ← Groq AI insight card with Generate button
│   │   ├── FiltroHeader.js      ← Small title + filter tags header for chart cards
│   │   ├── Tabs.js              ← Tab bar: general/ventas/sucursales/crecimiento/tickets/avanzado
│   │   ├── SinDatos.js          ← Placeholder card for unavailable metrics
│   │   ├── EmptyState.js        ← Full-page empty state with upload CTA
│   │   └── historial/           ← Upload history: modal, list, item, export, compare
│   └── utils/
│       └── filterUtils.js       ← applyAllFilters, getAvailableFilters (pure functions)
└── lib/
    ├── constants.js             ← CHART_COLORS, tooltip styles, axis tick styles, formatMillions
    └── parseExcel.js            ← All data parsing and aggregation functions
```

---

## Data flow

```
User uploads .xls/.xlsx
        ↓
parseExcelFile(file)           ← lib/parseExcel.js — client-side, FileReader
        ↓
pedidos[]                      ← array of normalized order objects (see shape below)
        ↓
FilterProvider(data=pedidos)   ← context/filterContext.js
        ↓
applyAllFilters(pedidos, filters)  ← filters: negocio, sucursal, fechaInicio, fechaFin
        ↓
filteredData[]                 ← what all charts consume
        ↓
datosCalculados = useMemo(...)  ← page.js: all aggregations run on filteredData
        ↓
Charts receive aggregated data as props
```

### Pedido object shape (after parseExcelFile)

```javascript
{
  id: "N° Pedido",
  tipo: "Tipo",
  fecha: Date,
  fechaStr: "DD-MM-YYYY",    // original string, used as key for daily aggregation
  hora: "HH:MM:SS",
  mes: "YYYY-MM",            // used for monthly/annual aggregation
  semana: "YYYY-SXX",
  diaSemana: "lunes",        // es-CL locale
  monto: Number,
  formaPago: "...",
  negocio: "...",
  sucursal: "...",
  estado: "..."
}
```

**PII removed at parse time**: `cajero`, `cliente`, `run` (Chilean RUT) are never stored.

---

## Aggregation functions (lib/parseExcel.js)

All accept `pedidos[]` and return derived data:

| Function | Returns | Used by |
|---|---|---|
| `agregarPorMes(pedidos)` | `[{mes:"YYYY-MM", total, cantidad}]` | InsightIA |
| `agregarPorSucursal(pedidos)` | `[{sucursal, total, cantidad}]` sorted desc | GraficoSucursales, RankingLocales, InsightIA |
| `agregarPorNegocio(pedidos)` | `[{negocio, total, cantidad}]` | GraficoNegocios |
| `agregarPorFormaPago(pedidos)` | `[{formaPago, cantidad, total}]` sorted desc | (reserved) |
| `agregarPorDia(pedidos)` | `[{dia:"DD-MM-YYYY", total, cantidad}]` sorted | EvolucionDiaria |
| `agregarPorMesYAnio(pedidos)` | `{anios:string[], data:[{mes:"Ene", 2023:n, 2024:n}]}` | VentasHistoricas, VentasAnualesComparativo |
| `agregarPorAnio(pedidos)` | `[{anio:"2024", total, cantidad}]` sorted | VentasAnualesTotal |
| `crecimientoVsAnioAnterior(pedidos)` | `{datos, anioActual, anioAnterior}` | CrecimientoVsAnterior |
| `ticketPromedioPorNegocio(pedidos)` | `[{negocio, total, cantidad, promedio}]` | TicketPromedio |
| `ticketPromedioPorTipo(pedidos)` | `[{tipo, total, cantidad, promedio}]` sorted desc | TicketPromedio |
| `formatCLP(monto)` | `"$1.234.567"` string | Passed as prop to all charts |

Month labels from `agregarPorMesYAnio` are `"Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"` — these must match `MESES` in `MonthToggle.js`.

---

## FilterContext API

`useFilterContext()` returns:

```javascript
{
  filters: {
    negocio: "todos" | "NombreNegocio",
    sucursal: "todos" | "NombreSucursal",
    fechaInicio: null | Date,
    fechaFin: null | Date,
    granularidad: "diario" | "mensual" | "anual"   // default: "mensual"
  },
  filteredData: pedidos[],     // raw orders after negocio/sucursal/date filters
  stats: {
    totalVentas: number,
    totalPedidos: number,
    sucursales: number,        // unique count
    ticketPromedio: number
  },
  availableFilters: {
    negocios: ["todos", ...],
    sucursales: ["todos", ...],
    dateRange: { min: Date, max: Date }
  },
  updateFilter: (key, value) => void,
  resetFilters: () => void,
  hasData: boolean
}
```

**Important**: `granularidad` is stored in FilterContext but is NOT applied by `applyAllFilters`. It is read by `page.js → TiempoChart` to switch between `EvolucionDiaria` / `VentasHistoricas` / `VentasAnualesTotal`.

---

## Granularidad — how it works

`FilterBar` renders `FilterGranularidad` which calls `updateFilter("granularidad", value)`.

In `page.js`, `DashboardContent` reads `filters.granularidad` and renders:

```javascript
function TiempoChart({ granularidad, datosCalculados }) {
  if (granularidad === "diario")  return <EvolucionDiaria ... />;
  if (granularidad === "anual")   return <VentasAnualesTotal ... />;
  return <VentasHistoricas ... />;  // default: mensual
}
```

`TiempoChart` appears in both the "general" tab and the "ventas" tab.

---

## Tabs

| Tab key | Content |
|---|---|
| `general` | TiempoChart + RankingLocales + InsightIA |
| `ventas` | TiempoChart + VentasAnualesComparativo + GraficoNegocios |
| `sucursales` | GraficoSucursales + RankingLocales + CrecimientoVsAnterior |
| `crecimiento` | CrecimientoVsAnterior + VentasAnualesComparativo |
| `tickets` | TicketPromedio |
| `avanzado` | 4× SinDatos placeholders (requires data not in Excel) |

---

## AI Insights pipeline

```
POST /api/insights
  { totalVentas, totalPedidos, datosMes[], datosSucursal[] }
        ↓
route.js — validates types, array lengths (max 120 months, 100 sucursales)
        ↓
insightsService.js — builds Spanish prompt with metrics + top-5 sucursales
        ↓
aiService.js — tries models in order:
  1. llama-3.3-70b-versatile
  2. llama-3.1-8b-instant
  3. mixtral-8x7b-32768
  4. gemma2-9b-it
        ↓
returns { insight: string, model: string }
        ↓
route.js returns { success: true, insight, metadata: { model, generatedAt, metrics }, performance: { durationMs } }
```

`InsightIA.js` checks `!res.ok || !data.success || !data.insight` to detect errors.

Required env var: `GROQ_API_KEY` (see `.env.example`). Without it, `aiService.js` throws on construction.

---

## Shared constants (lib/constants.js)

```javascript
CHART_COLORS       // 7-color palette, #002b54 base blues
CHART_TOOLTIP_STYLE
AXIS_TICK_X / AXIS_TICK_Y
formatMillions(v)  // "$1M"
formatMillionsDecimal(v)  // "$1.2M"
formatThousands(v) // "$123K"
```

All chart components import from here. `formatCLP` lives in `lib/parseExcel.js` (Intl.NumberFormat es-CL) and is passed as a prop.

---

## Global CSS classes (globals.css)

- `.card` — white card with border-radius, shadow, padding
- `.btn-primary` — navy fill button
- `.btn-secondary` — outlined button
- `.grid-2` — 2-column responsive grid for charts
- Chart cards that span full width use `style={{ gridColumn: "1 / -1" }}`

---

## Upload history (historial)

`useHistorial` hook (`components/ui/hooks/useHistorial.js`) persists to `localStorage`:
- Key: `"dashboardcg_historial"`
- Max 15 records, 4.5 MB cap
- Each entry: `{ id, fecha, archivos[], datos[] }`
- `HistorialModal` / `HistorialButton` / `RegistroItem` handle the UI

---

## Known constraints

1. **`agregarPorMesYAnio` month labels** must stay `"Ene"..."Dic"` — `MonthToggle.MESES` and `VentasHistoricasTabla` filter on these exact strings.
2. **Recharts `<Cell>`** must be used for per-bar coloring inside `<Bar>` — `<rect>` is invalid.
3. **Never mutate props arrays** — aggregation functions that sort must use `[...array].sort(...)`.
4. **`"use client"` required** on every component file — this project has no server components outside the API route.
5. **File extensions**: all component files use `.js`, not `.jsx`.
6. **`@anthropic-ai/sdk` and `@google/generative-ai` are in dependencies but unused** — only Groq is wired.
7. **No tests** exist in this project.
8. **The `avanzado` tab** cannot be implemented without data not present in the Excel (m², UF histórico, channel data, cost data).

---

## Packages worth knowing

- `xlsx` — client-side Excel parsing. `XLSX.read(data, { type: "array" })` on a `Uint8Array` from `FileReader`.
- `recharts` v3 — `LineChart`, `BarChart`, `AreaChart`, `ResponsiveContainer`, `Cell`, `LabelList`.
- `lucide-react` v1 — icon components: `Upload`, `RotateCcw`, `Sparkles`, `TrendingUp`, `TrendingDown`, `Filter`, etc.
- `date-fns` — installed but not currently used; date operations use native `Date`.
- `groq-sdk` — `new Groq({ apiKey })` → `groq.chat.completions.create(...)`.
