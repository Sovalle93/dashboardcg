"use client";
import { RegistroItem } from "./RegistroItem";

export function RegistroList({ 
  historial, 
  modoComparacion, 
  comparacionIds, 
  onToggleComparacion,
  onCargarRegistro,
  onEliminarRegistro,
  mostrarEliminar
}) {
  if (historial.length === 0) return null;

  return (
    <div style={{ maxHeight: 450, overflowY: "auto" }}>
      {historial.map((registro) => (
        <RegistroItem
          key={registro.id}
          registro={registro}
          modoComparacion={modoComparacion}
          seleccionado={comparacionIds.includes(registro.id)}
          onSelect={onToggleComparacion}
          onCargar={onCargarRegistro}
          onEliminar={onEliminarRegistro}
          mostrarEliminar={mostrarEliminar}
        />
      ))}
    </div>
  );
}