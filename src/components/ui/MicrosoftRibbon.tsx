import React from 'react';
import { LucideIcon } from 'lucide-react';

/** 1. Contenedor Principal **/
export const RibbonContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
    {children}
  </div>
);

/** 2. Ribbon Menu (Tabs superiores) **/
export const RibbonMenu = ({ children }: { children: React.ReactNode }) => (
  <nav className="flex items-center px-4 h-9 space-x-6 border-b border-slate-100 dark:border-slate-800/50 bg-blue-500/10">
    {children}
  </nav>
);

export const RibbonTab = ({ label, active }: { label: string, active?: boolean }) => (
  <button className={`h-full px-1 text-xs font-medium transition-all border-b-2 mt-1 ${active ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
    }`}>
    {label}
  </button>
);

/** 3. Ribbon Group (Secciones con separador) **/
export const RibbonGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="flex items-stretch border-r-2 my-2 border-slate-200/80 dark:border-slate-800 last:border-r-0">
    <div className="flex flex-col items-center p-1.5 min-w-20">
      <div className="flex items-center justify-center flex-1 space-x-1.5 px-2">
        {children}
      </div>
      <span className="text-[10px] text-slate-400 uppercase tracking-[0.1em] font-bold mt-1 select-none">
        {label}
      </span>
    </div>
  </div>
);

/** 4. Botones: Grande, Pequeño e Icono **/
export const RibbonBtnLarge = ({ icon: Icon, label, color = "text-slate-600", onClick }: { icon: LucideIcon, label: string, color?: string, onClick?: () => void }) => (
  <button onClick={onClick} className="flex flex-col items-center justify-center p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-all min-w-16">
    <Icon className={`w-8 h-8 ${color} stroke-[1.5]`} />
    <span className="text-[11px] font-medium mt-1 text-slate-700 dark:text-slate-300">{label}</span>
  </button>
);

export const RibbonBtnSmall = ({ icon: Icon, label, color = "text-slate-500", onClick }: { icon: LucideIcon, label: string, color?: string, onClick?: () => void }) => (
  <button onClick={onClick} className="flex items-center space-x-2 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-all w-full text-left">
    <Icon className={`w-4 h-4 ${color} stroke-2`} />
    <span className="text-[12px] text-slate-700 dark:text-slate-300 whitespace-nowrap">{label}</span>
  </button>
);

export const RibbonBtnIcon = ({ icon: Icon, onClick }: { icon: LucideIcon, onClick?: () => void }) => (
  <button onClick={onClick} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center">
    <Icon className="w-4 h-4 text-slate-600 stroke-[2.5]" />
  </button>
);

/** 5. Form Elements **/
export const RibbonCheck = ({ label }: any) => (
  <label className="flex items-center space-x-2 px-2 cursor-pointer group">
    <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer" />
    <span className="text-[12px] text-slate-600 group-hover:text-slate-900 transition-colors">{label}</span>
  </label>
);

export const RibbonCombo = ({ options }: { options: string[] }) => (
  <select className="text-[12px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1 py-0.5 outline-none focus:border-blue-400">
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);