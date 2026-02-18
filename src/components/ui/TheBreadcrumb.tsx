// components/ui/Breadcrumb.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb = () => {
  const pathname = usePathname();

  // 1. Obtenemos todos los segmentos
  const allSegments = pathname.split('/').filter((item) => item !== "");

  /**
   * 2. Lógica de Filtrado:
   * Tu ruta es: /dashboard/[companyId]/inventory/...
   * Índices:       0           1           2
   * Queremos que 'segments' contenga solo a partir del índice 2.
   */
  const segments = allSegments.slice(2);

  const formatSegment = (segment: string) => {
    return decodeURIComponent(segment)
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Si no hay nada después del ID, no mostramos nada o solo el Home
  if (segments.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 py-2 px-4 text-[13px] font-medium text-slate-500 bg-transparent">
      {/* Icono de Inicio (opcional, puedes quitarlo si quieres que sea aún más limpio) */}
      <Link
        href={`/dashboard/${allSegments[1]}/overview`}
        className="flex items-center hover:text-blue-600 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      <ChevronRight className="w-3.5 h-3.5 text-slate-300" strokeWidth={3} />

      {segments.map((segment, index) => {
        const isLast = index === segments.length;

        /**
         * Construimos el href reconstruyendo la ruta completa:
         * /dashboard/[companyId] + los segmentos actuales hasta el índice actual
         */
        const href = `/dashboard/${allSegments[1]}/${segments.slice(0, index + 1).join('/')}`;

        return (
          <React.Fragment key={href}>
            {isLast ? (
              <span className="text-slate-900 dark:text-slate-200 font-semibold">
                {formatSegment(segment)}
              </span>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href={href}
                  className="hover:text-blue-600 transition-colors"
                >
                  {formatSegment(segment)}
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" strokeWidth={3} />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};