// components/ui/Breadcrumb.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export const Breadcrumb = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Obtenemos todos los segmentos
  const allSegments = pathname.split('/').filter((item) => item !== "");

  // Mapeo de nombres técnicos a nombres legibles en español
  const segmentLabels: Record<string, string> = {
    "payroll": "Nómina",
    "inventory": "Inventario",
    "sales": "Ventas",
    "invoices": "Facturación",
    "settings": "Configuración",
    "companies": "Empresas",
    "branches": "Sucursales",
    "users": "Usuarios",
    "system-date": "Fecha del Sistema",
    "reports": "Reportes",
    "movements": "Movimientos",
    "adjustments": "Ajustes",
    "customers": "Clientes",
    "overview": "Resumen",
    "modules": "Módulos",
    "new": "Nuevo",
    "edit": "Editar",
    // Vistas parametrizadas (views)
    "history": "Historial",
    "processing": "Procesamiento",
    "employees": "Personal",
    "benefits": "Beneficios",
    "department-costs": "Análisis Costos",
    "cost-summary": "Resumen de Costos"
  };

  /**
   * 2. Lógica de Filtrado:
   * Tu ruta es: /dashboard/[companyId]/...
   * Queremos que 'segments' contenga solo lo que sigue al ID.
   */
  const baseSegments = allSegments.slice(2);

  // Agregar el parámetro 'view' si existe para mostrar la "pantalla final"
  const viewParam = searchParams.get('view');
  const segments = viewParam ? [...baseSegments, viewParam] : baseSegments;

  const formatSegment = (segment: string) => {
    // Si existe en el mapa, lo usamos
    if (segmentLabels[segment.toLowerCase()]) {
      return segmentLabels[segment.toLowerCase()];
    }

    // Si no, formateamos normal (reemplazar guiones y capitalizar)
    return decodeURIComponent(segment)
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Si no hay nada después del ID, no mostramos nada
  if (segments.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 py-2 px-0 text-[11px] font-bold text-[#605e5c] uppercase tracking-tight bg-transparent">
      {/* Icono de Inicio */}
      <Link
        href={`/dashboard/${allSegments[1]}/overview`}
        className="flex items-center hover:text-[#0078d4] transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      <ChevronRight className="w-3 h-3 text-[#d2d0ce]" />

      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;

        /**
         * Construimos el href:
         * Si es un segmento de ruta normal, reconstruimos la ruta.
         * Si es el parámetro 'view', agregamos ?view= al path base.
         */
        const isViewSegment = index >= baseSegments.length;
        const href = isViewSegment
          ? `/dashboard/${allSegments[1]}/${baseSegments.join('/')}?view=${segment}`
          : `/dashboard/${allSegments[1]}/${segments.slice(0, index + 1).join('/')}`;

        return (
          <React.Fragment key={`${href}-${index}`}>
            {isLast ? (
              <span className="text-[#323130] font-black">
                {formatSegment(segment)}
              </span>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href={href}
                  className="hover:text-[#0078d4] transition-colors"
                >
                  {formatSegment(segment)}
                </Link>
                <ChevronRight className="w-3 h-3 text-[#d2d0ce]" />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};