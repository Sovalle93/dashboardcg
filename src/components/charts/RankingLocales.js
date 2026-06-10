"use client";
import FiltroHeader from "@/components/ui/FiltroHeader";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function RankingLocales({ datos, formatCLP, theme }) {
  const total = datos.reduce((s, d) => s + d.total, 0);

  return (
    <div className="card">
      <FiltroHeader titulo="Ranking completo de locales" filtros={["Año en curso", "CLP"]} />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {datos.map((d, i) => {
          const pct = ((d.total / total) * 100).toFixed(1);
          return (
            <div key={d.sucursal}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14 }}>{MEDALS[i] ?? `#${i + 1}`}</span>
                  <span style={{ fontSize: 13, color: "#333", fontWeight: 500 }}>{d.sucursal}</span>
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#002b54" }}>{pct}%</span>
                  <span style={{ fontSize: 12, color: "#999", minWidth: 90, textAlign: "right" }}>
                    {formatCLP(d.total)}
                  </span>
                </div>
              </div>
              <div style={{ background: "#f0f4f8", borderRadius: 99, height: 8, overflow: "hidden" }}>
                <div style={{
                  width: `${pct}%`,
                  height: "100%",
                  borderRadius: 99,
                  background: i < 3 ? (theme?.accent ?? '#002b54') : '#4a90d9',
                  transition: "width 0.6s ease"
                }} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{
        marginTop: 20,
        paddingTop: 16,
        borderTop: "1px solid #f0f0f0",
        display: "flex",
        justifyContent: "space-between"
      }}>
        <span style={{ fontSize: 12, color: "#999" }}>Total acumulado</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{formatCLP(total)}</span>
      </div>
    </div>
  );
}
