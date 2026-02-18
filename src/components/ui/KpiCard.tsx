"use client";

import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BCTileProps {
  titulo: string;
  contenido: string | number;
  descripcion: string;
  color?: string;
  onClick?: () => void;
}

export const KpiCard = ({
  titulo,
  contenido,
  descripcion,
  color = "#0078d4",
  onClick
}: BCTileProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-slate-900 p-4 shadow-sm border border-slate-200 dark:border-slate-800 border-l-[6px] hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group h-32 flex flex-col justify-between relative"
      /* Usamos style directamente para el borde dinámico */
      style={{ borderLeftColor: color }}
    >
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-sm">
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      <h3 className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-tight">
        {titulo}
      </h3>

      <div className="flex flex-col items-start mt-2">
        <span
          className="text-4xl font-light"
          /* Usamos style directamente para el texto dinámico */
          style={{ color: color }}
        >
          {contenido}
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          {descripcion}
        </span>
      </div>
    </div>
  );
};