"use client";
import { memo } from "react";

export const MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

const MonthToggle = memo(function MonthToggle({ selectedMonths, onChange, colorBase = "#002b54" }) {
  const allSelected = selectedMonths.length === MESES.length;

  const toggle = (mes) => {
    if (selectedMonths.includes(mes)) {
      onChange(selectedMonths.filter((m) => m !== mes));
    } else {
      const next = [...selectedMonths, mes];
      onChange(next.sort((a, b) => MESES.indexOf(a) - MESES.indexOf(b)));
    }
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16, alignItems: "center" }}>
      <button
        onClick={() => onChange([...MESES])}
        style={{
          padding: "4px 10px",
          fontSize: 11,
          fontWeight: 600,
          borderRadius: 6,
          border: `1px solid ${colorBase}`,
          background: allSelected ? colorBase : "transparent",
          color: allSelected ? "#fff" : colorBase,
          cursor: "pointer",
          transition: "all 0.15s",
        }}
      >
        Todos
      </button>
      <button
        onClick={() => onChange([])}
        style={{
          padding: "4px 10px",
          fontSize: 11,
          fontWeight: 600,
          borderRadius: 6,
          border: "1px solid #ddd",
          background: "transparent",
          color: "#999",
          cursor: "pointer",
          transition: "all 0.15s",
        }}
      >
        Ninguno
      </button>
      <div style={{ width: 1, height: 20, background: "#e8e8e8", margin: "0 2px" }} />
      {MESES.map((mes) => {
        const active = selectedMonths.includes(mes);
        return (
          <button
            key={mes}
            onClick={() => toggle(mes)}
            style={{
              padding: "4px 8px",
              fontSize: 11,
              fontWeight: active ? 700 : 400,
              borderRadius: 6,
              border: `1px solid ${active ? colorBase : "#ddd"}`,
              background: active ? colorBase : "#fff",
              color: active ? "#fff" : "#666",
              cursor: "pointer",
              transition: "all 0.15s",
              minWidth: 36,
            }}
          >
            {mes}
          </button>
        );
      })}
    </div>
  );
});

export default MonthToggle;
