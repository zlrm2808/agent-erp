"use client";

import * as Icons from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const IconResolver = ({ name, className }: { name: string, className?: string }) => {
  const Icon = (Icons as any)[name];
  if (!Icon) return null;
  return <Icon className={className} />;
};

/** 1. Contenedor Principal **/
export const RibbonContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col w-full bg-[#fdfdfd] dark:bg-slate-900 border-y border-[#d2d0ce] dark:border-slate-800 shadow-[0_2px_5px_rgba(0,0,0,0.05)] z-20">
    {children}
  </div>
);

/** 2. Ribbon Group (Secciones con separador) **/
export const RibbonGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="flex items-stretch border-r border-[#e1dfdd] dark:border-slate-800 last:border-r-0">
    <div className="flex flex-col items-center p-2 min-w-[70px]">
      <div className="flex items-center justify-center flex-1 space-x-1 px-1">
        {children}
      </div>
      <span className="text-[9px] text-[#605e5c] uppercase tracking-tighter font-semibold mt-1.5 select-none opacity-80">
        {label}
      </span>
    </div>
  </div>
);

/** 3. Botones: Grande, Pequeño e Icono **/
export const RibbonBtnLarge = ({ icon, label, color = "text-slate-600", onClick, href, active }: { icon: string, label: string, color?: string, onClick?: () => void, href?: string, active?: boolean }) => {
  const content = (
    <>
      <div className="relative group">
        <IconResolver name={icon} className={`w-8 h-8 ${color} stroke-[1.2] transition-transform duration-200 group-hover:scale-110 ${active ? 'scale-110 text-[#0078d4]' : ''}`} />
      </div>
      <span className={cn("text-[11px] font-medium mt-1 text-[#323130] dark:text-slate-300", active && "text-[#0078d4] font-bold")}>{label}</span>
    </>
  );

  const className = cn(
    "flex flex-col items-center justify-center p-2 rounded-sm transition-all min-w-[64px] group relative",
    active ? "bg-[#eff6fc] border border-[#0078d4]/20" : "hover:bg-[#eff6fc] dark:hover:bg-slate-800 border border-transparent"
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className} type="button">
      {active && <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#0078d4]" />}
      {content}
    </button>
  );
};

export const RibbonBtnSmall = ({ icon, label, color = "text-slate-500", onClick, href }: { icon: string, label: string, color?: string, onClick?: () => void, href?: string }) => {
  const content = (
    <>
      <IconResolver name={icon} className={`w-4 h-4 ${color} stroke-[2]`} />
      <span className="text-[11px] text-[#323130] dark:text-slate-300 whitespace-nowrap">{label}</span>
    </>
  );

  const className = "flex items-center space-x-2 px-3 py-1.5 rounded-sm hover:bg-[#eff6fc] dark:hover:bg-slate-800 transition-all w-full text-left group";

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className} type="button" aria-label={label}>
      {content}
    </button>
  );
};

export const RibbonBtnIcon = ({ icon, onClick }: { icon: string, onClick?: () => void }) => (
  <button onClick={onClick} className="p-1.5 rounded-sm hover:bg-[#f3f2f1] dark:hover:bg-slate-800 flex items-center justify-center transition-colors">
    <IconResolver name={icon} className="w-4 h-4 text-[#605e5c] stroke-[2]" />
  </button>
);