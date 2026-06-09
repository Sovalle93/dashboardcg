"use client";
import { BarChart2 } from "lucide-react";

export default function AppHeader() {
  return (
    <header style={{ background: "#002b54", boxShadow: "0 2px 12px rgba(0,0,0,0.15)" }}>
      <div style={{
        maxWidth: 1140,
        margin: "0 auto",
        padding: "18px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 10,
            background: "rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <BarChart2 size={22} color="#fff" />
          </div>
          <div>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 17, lineHeight: 1.2 }}>Cerogrado</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 2 }}>
              Sistema de Reportes · Trampoline Park
            </p>
          </div>
        </div>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
          {new Date().toLocaleDateString("es-CL", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>
    </header>
  );
}
