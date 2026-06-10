@AGENTS.md

# dashboardcg — Project Rules & Knowledge Base

## What this project is

Sales analytics dashboard for **Cerogrado** (Chilean trampoline park chain). Users upload Excel files exported from their POS system. The app parses them client-side, runs aggregations, and renders comparative charts. A Groq AI endpoint generates natural-language business insights on demand.

**No database. No auth. Fully client-side data processing.**

---

## Tech stack (exact versions — do not assume)

| Concern | Library |
|---|---|
| Framework | **Next.js 16** App Router, React 19 |
| Charts | **Recharts 3** |
| Icons | lucide-react |
| Excel parsing | xlsx (client-side, FileReader API) |
| PDF export | **jspdf + jspdf-autotable** (dynamic import, client-side only) |
| AI backend | **Groq SDK** — llama-3.3-70b-versatile with model fallback |
| Fonts | Google Fonts — Montserrat via `next/font` |
| Styling | **Inline styles + global CSS classes** (`.card`, `.btn-primary`, `.btn-secondary`, `.grid-2`) |
| Locale | `es-CL` throughout — Chilean Spanish, CLP currency |

**Critical constraints:**
- **JavaScript only — no TypeScript, no `.jsx` extensions**
- **No Tailwind utility classes in JSX** (Tailwind 4 is installed but only used via `globals.css` — do not add tw classes to components)
- **No CSS modules** — all styling is inline styles or the global classes above
- `"use client"` required on every component file — this project has no server components except the API route
- File extensions: `.js` only

---

## Brand & design

- Primary brand color: `#002b54` (dark navy)
- Background: `#f8f8f8`
- Font: Montserrat (loaded via Next.js font system)
- Light theme — all text stays dark (`#111`, `#333`, `#666`) for legibility
- Default chart palette: `CHART_COLORS` from `src/lib/constants.js`
- **Brand theming:** `src/lib/theme.js` — `getTheme(negocio)` returns a brand object when a single negocio is selected, `null` when "todos"

### Theme system — `src/lib/theme.js`

```javascript
// getTheme(negocio) → null | { accent, textOnAccent, palette }
NEGOCIO_THEMES = {
  'Trampoline Park': { accent: '#ffeb00', textOnAccent: '#111', palette: [7 gold shades] },
  'Cerogrado':       { accent: '#00acc9', textOnAccent: '#fff', palette: [7 teal shades] },
}
```

**Rules (never violate):**
- `accent` → bar fills, area strokes, progress bars, active button backgrounds only
- `palette` → replaces `CHART_COLORS` for Cell-based multi-bar fills
- **Never use accent for text** — yellow (#ffeb00) is illegible on white
- **All text stays dark** (`#111`/`#333`/`#002b54`) regardless of theme
- Chart components: `const accent = theme?.accent ?? '#002b54'` and `const colors = theme?.palette ?? CHART_COLORS`
- `theme` is read from `useFilterContext()` in `DashboardContent` and passed as a prop through the component tree

---

## Folder structure

```
src/
├── app/
│   ├── page.js                  ← Entry point: Home + DashboardContent + Seccion + TiempoChart
│   ├── layout.js                ← Root layout, Montserrat font
│   ├── globals.css              ← .card, .btn-primary, .btn-secondary, .grid-2, .grid-4
│   ├── api/
│   │   └── insights/route.js    ← POST /api/insights (Groq AI)
│   ├── services/
│   │   ├── aiService.js         ← Groq SDK wrapper, model fallback chain
│   │   └── insightsService.js   ← Prompt builder, calls aiService
│   └── utils/
│       └── validators.js        ← Input validation for API route
├── components/
│   ├── charts/
│   │   ├── VentasHistoricas.js       ← Line chart: monthly sales, multi-year + MonthToggle + VentasHistoricasTabla
│   │   ├── VentasHistoricasTabla.js  ← Comparison table (current vs prior year, or single-year detail)
│   │   ├── VentasAnualesTotal.js     ← Bar chart: one bar per year (granularidad=anual)
│   │   ├── VentasAnualesComparativo.js ← Grouped bar: current vs prior year per month
│   │   ├── VentasNegocioLineas.js    ← Line chart: one line per negocio + dashed Total; hidden when <2 negocios
│   │   ├── EvolucionDiaria.js        ← Area chart: daily sales (granularidad=diario)
│   │   ├── GraficoNegocios.js        ← Bar/pie toggle: sales by negocio
│   │   ├── GraficoFormaPago.js       ← Bar/pie toggle: revenue by forma de pago
│   │   ├── GraficoSucursales.js      ← Progress-bar list: top 7 sucursales
│   │   ├── GraficoCantidadTipo.js    ← Bar chart: order COUNT by tipo
│   │   ├── RankingLocales.js         ← Full ranked list with medal icons
│   │   ├── CrecimientoVsAnterior.js  ← YoY growth bar per sucursal
│   │   └── TicketPromedio.js         ← Avg ticket by negocio (bar) + by tipo (list)
│   ├── context/
│   │   └── filterContext.js     ← FilterProvider + useFilterContext
│   ├── filters/
│   │   ├── FilterBar.js         ← Combined filter bar (negocio, sucursal, tipo, dates, granularidad)
│   │   ├── FilterSelect.js      ← Reusable <select> with label
│   │   ├── FilterDatePicker.js  ← Date range inputs
│   │   └── FilterGranularidad.js ← Toggle: diario / mensual / anual (uses theme.accent for active state)
│   ├── layout/
│   │   ├── AppHeader.js         ← Cerogrado branding + current date
│   │   └── GlobalResumenCards.js ← 4-metric KPI cards (reads from FilterContext)
│   ├── ui/
│   │   ├── MonthToggle.js       ← Month filter buttons Ene–Dic, exports MESES array
│   │   ├── InsightIA.js         ← Groq AI insight card
│   │   ├── FiltroHeader.js      ← Chart card title + tag pills (flex row, space-between)
│   │   ├── Tabs.js              ← Tab bar: general/ventas/sucursales/crecimiento/tickets/avanzado
│   │   ├── SinDatos.js          ← Placeholder for unavailable metrics
│   │   ├── EmptyState.js        ← Full-page empty state
│   │   └── historial/           ← Upload history: modal, list, item, ExportPanel (PDF), utils
│   └── utils/
│       └── filterUtils.js       ← applyAllFilters, getAvailableFilters, individual filter fns
└── lib/
    ├── constants.js             ← CHART_COLORS, CHART_TOOLTIP_STYLE, AXIS_TICK_*, formatMillions/Thousands
    ├── parseExcel.js            ← All data parsing and aggregation functions
    └── theme.js                 ← NEGOCIO_THEMES, getTheme(negocio)
```

---

## Data flow (memorize this)

```
User uploads .xls/.xlsx
        ↓
parseExcelFile(file)           ← client-side FileReader → Uint8Array → XLSX.read
        ↓
pedidos[]                      ← normalized order objects (see shape below)
        ↓
FilterProvider(data=pedidos)   ← filterContext.js wraps DashboardContent
        ↓
useMemo → applyAllFilters(pedidos, filters)   ← SYNCHRONOUS, no useEffect delay
        ↓
filteredData[]                 ← what every chart consumes
        ↓
DashboardContent calls useFilterContext() → gets filteredData + filters + theme
        ↓
datosCalculados = useMemo(all agregarPorX on filteredData)
        ↓
Charts receive aggregated props + theme — no chart calls agregarPorX internally
```

**The golden rule:** Every chart receives pre-aggregated data as a prop computed from `filteredData`. No chart component may call an aggregation function directly on raw data.

---

## Pedido object shape (after parseExcelFile)

```javascript
{
  id:        string,          // "N° Pedido"
  tipo:      string,          // "Individual"|"Cumpleaños"|"Grupal"|"Adicional"|"Clases"|"Sin tipo"
  fecha:     Date,
  fechaStr:  "DD-MM-YYYY",   // original string — key for daily aggregation
  hora:      "HH:MM:SS",
  mes:       "YYYY-MM",      // key for monthly/annual aggregation
  semana:    "YYYY-SXX",
  diaSemana: string,         // es-CL locale ("lunes", "martes", …)
  monto:     number,
  formaPago: string,
  negocio:   string,
  sucursal:  string,
  estado:    string,
}
```

**PII removed at parse time:** `cajero`, `cliente`, `run` (Chilean RUT) are stripped and never stored.

---

## Aggregation functions — `src/lib/parseExcel.js`

All accept `pedidos[]`, return derived data. Always call on `filteredData`, never raw data.

| Function | Returns | Used in datosCalculados as |
|---|---|---|
| `agregarPorMes(p)` | `[{mes:"YYYY-MM", total, cantidad}]` sorted asc | `datosMes` → InsightIA |
| `agregarPorSucursal(p)` | `[{sucursal, total, cantidad}]` sorted desc by total | `datosSucursal` |
| `agregarPorNegocio(p)` | `[{negocio, total, cantidad}]` | `datosNegocio` |
| `agregarPorFormaPago(p)` | `[{formaPago, cantidad, total}]` sorted desc by count | `datosFormaPago` |
| `agregarPorDia(p)` | `[{dia:"DD-MM-YYYY", total, cantidad}]` sorted asc | `datosDiarios` |
| `agregarPorMesYAnio(p)` | `{anios:string[], data:[{mes:"Ene", "2023":n, …}]}` | `datosHistoricos` |
| `agregarPorAnio(p)` | `[{anio:"2024", total, cantidad}]` sorted asc | `datosAnuales` |
| `agregarPorTipo(p)` | `[{tipo, cantidad, total}]` sorted desc by count | `datosTipo` |
| `agregarPorMesYNegocio(p)` | `{negocios:string[], data:[{mes:"YYYY-MM", negocio1:n, total:n}]}` | `datosNegocioLineas` |
| `crecimientoVsAnioAnterior(p)` | `{datos, anioActual, anioAnterior}` | `datosCrecimiento` |
| `ticketPromedioPorNegocio(p)` | `[{negocio, total, cantidad, promedio}]` | `datosTicketNegocio` |
| `ticketPromedioPorTipo(p)` | `[{tipo, total, cantidad, promedio}]` sorted desc by promedio | `datosTicketTipo` |
| `formatCLP(n)` | `"$1.234.567"` — es-CL Intl.NumberFormat | passed as prop to charts |

**Month labels from `agregarPorMesYAnio`:** `"Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"` — these must exactly match `MESES` exported from `MonthToggle.js`.

---

## FilterContext API — `src/components/context/filterContext.js`

`useFilterContext()` returns:

```javascript
{
  filters: {
    negocio:      "todos" | string,    // default "todos"
    sucursal:     "todos" | string,    // default "todos"; auto-reset when negocio changes
    tipo:         "todos" | string,    // default "todos"
    fechaInicio:  null | Date,
    fechaFin:     null | Date,
    granularidad: "diario" | "mensual" | "anual"  // default "mensual"
  },
  filteredData:     pedido[],          // raw orders after all filters applied (synchronous via useMemo)
  stats: {
    totalVentas:    number,
    totalPedidos:   number,
    sucursales:     number,            // unique count
    ticketPromedio: number
  },
  availableFilters: {
    negocios:   ["todos", ...],        // all negocios in raw data
    sucursales: ["todos", ...],        // CASCADING: filtered to selected negocio's sucursales only
    tipos:      ["todos", ...],
    dateRange:  { min: Date, max: Date }
  },
  theme:         null | { accent, textOnAccent, palette },  // from getTheme(filters.negocio)
  updateFilter:  (key, value) => void,   // negocio change auto-resets sucursal to 'todos'
  resetFilters:  () => void,
  hasData:       boolean
}
```

**Cascading sucursal filter:** `availableFilters.sucursales` recomputes when `filters.negocio` changes — only shows sucursales belonging to that negocio. `updateFilter('negocio', val)` also auto-resets `sucursal` to `'todos'`.

---

## Filter pipeline — `src/components/utils/filterUtils.js`

`applyAllFilters(data, filters)` applies in this order:
1. `filterDataByNegocio` — `item.negocio === filters.negocio`
2. `filterDataBySucursal` — `item.sucursal === filters.sucursal`
3. `filterDataByTipo` — `item.tipo === filters.tipo`
4. `filterDataByDateRange` — `item.fecha` between `fechaInicio` and `fechaFin`

`granularidad` is NOT applied by `applyAllFilters` — it controls which chart component renders (diario/mensual/anual), not which rows are included.

---

## Granularidad — how the switcher works

`TiempoChart` in `page.js` switches on `filters.granularidad`:

```javascript
function TiempoChart({ granularidad, datosCalculados, theme }) {
  if (granularidad === "diario")  return <EvolucionDiaria ... theme={theme} />;
  if (granularidad === "anual")   return <VentasAnualesTotal ... theme={theme} />;
  return <VentasHistoricas ... theme={theme} />;  // default: mensual
}
```

`TiempoChart` appears in both "general" and "ventas" tabs.

---

## Tabs and their content

| Tab key | Content |
|---|---|
| `general` | VentasNegocioLineas (if ≥2 negocios) + TiempoChart + RankingLocales + InsightIA |
| `ventas` | VentasNegocioLineas (if ≥2 negocios) + TiempoChart + VentasAnualesComparativo + GraficoNegocios + GraficoFormaPago |
| `sucursales` | GraficoSucursales + RankingLocales + CrecimientoVsAnterior |
| `crecimiento` | CrecimientoVsAnterior + VentasAnualesComparativo |
| `tickets` | TicketPromedio (2 cards) + GraficoCantidadTipo |
| `avanzado` | 4× SinDatos placeholders (requires data not in Excel) |

**VentasNegocioLineas** renders only when `datosNegocioLineas.negocios.length >= 2` (self-hides when a single negocio is filtered). Colors are fixed brand colors defined inside the component: Cerogrado `#00acc9`, Trampoline Park `#c49800` (dark gold — legible on white), Total `#002b54` dashed.

---

## Bar/pie toggle pattern (GraficoNegocios + GraficoFormaPago)

Both charts use the same pattern:
- `const [tipoGrafico, setTipoGrafico] = useState('bar')` inside the component
- Header row has the chart title (left) and "Barras / Torta" buttons (right), **replacing** the standard `<FiltroHeader>` call
- Active toggle button uses `theme?.accent ?? '#002b54'` for background, `theme?.textOnAccent ?? '#fff'` for text
- Pie mode: `<PieChart>` + `<Pie>` with `Cell` per-sector — **no inline `label` prop, no Recharts `<Legend>`** (avoids text clashing); tooltip on hover + custom legend div below provides all info
- Bar mode: standard `<BarChart>` with `Cell` per-bar and `<LabelList>`
- The custom color-swatch legend div below the chart appears in both modes

---

## PDF export — `src/components/ui/historial/`

`ExportPanel.js` replaces the old Excel export. Calls `exportarAPDF` from `utils.js`.

`exportarAPDF(pedidosExportar, titulo)` in `utils.js`:
- Dynamic imports: `await import('jspdf')` + `await import('jspdf-autotable')` — loads ~300KB only on button click
- Aggregates data inline (by mes, negocio, sucursal top-10, tipo) from the raw `pedidosExportar` array
- PDF structure (A4, portrait): navy header band with title + date, three KPI cards (total ventas / pedidos / ticket), then four `autoTable` sections (mes / negocio / sucursal / tipo), navy footer with page numbers on every page
- File saved as `informe_ventas_YYYY-MM-DD.pdf`
- Button shows "Generando…" + `cursor: not-allowed` while async export runs

---

## Shared constants — `src/lib/constants.js`

```javascript
CHART_COLORS        // ["#002b54","#1a5276","#4a90d9","#7ec8f4","#b0d9f7","#034078","#1282a2"]
CHART_TOOLTIP_STYLE // { borderRadius: 10, fontSize: 13, border: "1px solid #e8e8e8", fontFamily: "inherit" }
AXIS_TICK_X         // { fill: "#888", fontSize: 11, fontFamily: "inherit" }
AXIS_TICK_Y         // { fill: "#888", fontSize: 10, fontFamily: "inherit" }
formatMillions(v)         // "$1M"
formatMillionsDecimal(v)  // "$1.2M"
formatThousands(v)        // "$123K"
```

`formatCLP` lives in `lib/parseExcel.js` (Intl.NumberFormat es-CL) and is **passed as a prop** to all charts — never imported directly inside chart components.

---

## AI Insights pipeline

```
POST /api/insights
  { totalVentas, totalPedidos, datosMes[], datosSucursal[] }
        ↓
route.js — validates types + array length limits (120 months, 100 sucursales)
        ↓
insightsService.js — builds Spanish prompt, calls aiService
        ↓
aiService.js — tries Groq models in order:
  1. llama-3.3-70b-versatile
  2. llama-3.1-8b-instant
  3. mixtral-8x7b-32768
  4. gemma2-9b-it
        ↓
returns { insight: string, model: string }
        ↓
route.js returns { success: true, insight, metadata: { model, generatedAt, metrics }, performance }
```

**Required env var:** `GROQ_API_KEY` (see `.env.example`)
**Do not change** the AI model or provider — the client uses Groq, not Anthropic.

---

## Upload history

`useHistorial` hook in `src/components/ui/hooks/useHistorial.js`:
- Persists to `localStorage` key `"dashboardcg_historial"`
- Max 15 records, 4.5 MB total cap
- Each entry: `{ id, fecha, archivos[], datos[] }`

---

## Critical rules — never violate these

1. **Recharts per-bar coloring:** Use `<Cell key={i} fill={...} />` inside `<Bar>` — never `<rect>`
2. **Never mutate prop arrays:** Any sort/filter must use `[...array].sort(...)` — spread first
3. **All aggregations on filteredData:** Chart data flows through `datosCalculados` in `page.js`, which calls aggregation functions on `filteredData` from `useFilterContext()`
4. **Month labels must match:** `agregarPorMesYAnio` produces `"Ene"…"Dic"` — `MonthToggle.MESES` must use the same exact strings
5. **File extensions:** `.js` only — never `.jsx`, `.ts`, `.tsx`
6. **`"use client"` on every component:** No server components outside `app/api/`
7. **No new aggregation functions inside chart components:** Aggregation belongs in `parseExcel.js`, composition belongs in `page.js datosCalculados`
8. **Avoid wholesale rewrites:** Make targeted edits — preserve working code
9. **Theme text rule:** `accent` color is ONLY for fills/backgrounds. Text always stays dark regardless of theme. Yellow (#ffeb00) is illegible as text or thin lines.
10. **Pie charts — no inline labels:** Do not add `label` prop or `<Legend>` inside `<PieChart>` — they clash with custom legend divs. Use tooltip + custom div below only.
11. **jsPDF is browser-only:** Always `await import('jspdf')` dynamically inside async functions — never top-level import.

---

## Phase status (complete)

| Phase | Status | Summary |
|---|---|---|
| Phase 0 — Architecture audit | ✅ Done | All charts confirmed to use filteredData. filterContext.js: useState+useEffect → useMemo for synchronous derived state |
| Phase 1 — Filter by tipo | ✅ Done | `tipo` added to filter pipeline. `agregarPorTipo` in parseExcel.js. `GraficoCantidadTipo` chart in tickets tab |
| Phase 2 — Conditional brand theming | ✅ Done | `theme.js` with NEGOCIO_THEMES. All 10 chart components accept `theme` prop. Accent for fills, palette for Cell multi-bar, text always dark |
| Phase 2 extras | ✅ Done | VentasNegocioLineas (3-line negocio comparison chart). Cascading sucursal filter (filters to selected negocio's sucursales, auto-resets on negocio change) |
| Phase 3 — Chart type toggle | ✅ Done | Bar/pie toggle on GraficoNegocios and GraficoFormaPago (new). Pie mode uses no inline labels to prevent text clashing |
| Phase 4 — PDF export | ✅ Done | jspdf + jspdf-autotable. ExportPanel replaced: Excel → PDF. exportarAPDF in utils.js reconstructs report from data (4 tables + KPI cards + brand header/footer) |

---

## Packages worth knowing

- `xlsx` — `XLSX.read(data, { type: "array" })` on Uint8Array from FileReader
- `recharts` v3 — LineChart, BarChart, AreaChart, PieChart, ResponsiveContainer, Cell, LabelList, Pie
- `jspdf` + `jspdf-autotable` — PDF generation, always dynamically imported
- `lucide-react` — Upload, RotateCcw, FileText, TrendingUp, TrendingDown, Filter, etc.
- `groq-sdk` — `new Groq({ apiKey })` → `groq.chat.completions.create(...)`
- `@anthropic-ai/sdk` and `@google/generative-ai` — **installed but unused** — ignore them
- `date-fns` — **installed but unused** — use native Date
