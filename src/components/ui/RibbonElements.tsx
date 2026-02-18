import React from 'react';

// 1. Ribbon Menu (Navbar superior)
export const RibbonMenu = ({ tabs, activeTab }: { tabs: string[], activeTab: string }) => (
  <div className="flex items-center space-x-6 px-4 h-8 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
    {tabs.map(tab => (
      <button key={tab} className={`text-xs font-medium px-1 h-full border-b-2 transition-colors ${tab === activeTab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
        }`}>
        {tab}
      </button>
    ))}
  </div>
);

// 2. Ribbon Group (Contenedor de sección)
export const RibbonGroup = ({ children, label }: { children: React.ReactNode, label: string }) => (
  <div className="flex items-stretch group/group">
    <div className="flex flex-col items-center px-3 py-1 space-y-1">
      <div className="flex items-center justify-center flex-1 space-x-2">
        {children}
      </div>
      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold select-none">
        {label}
      </span>
    </div>
    <div className="w-px h-16 bg-slate-200 dark:bg-slate-800 self-center" />
  </div>
);

// 3. Ribbon btnLarge
export const RibbonBtnLarge = ({ icon, label, onClick, color = "text-blue-600" }: any) => (
  <button onClick={onClick} className="flex flex-col items-center justify-center p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 min-w-13.5 transition-colors">
    <span className={`material-icons text-3xl ${color}`}>{icon}</span>
    <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">{label}</span>
  </button>
);

// 4. Ribbon btnSmall
export const RibbonBtnSmall = ({ icon, label, onClick, color = "text-slate-600" }: any) => (
  <button onClick={onClick} className="flex items-center space-x-2 px-2 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 w-full transition-colors text-left">
    <span className={`material-icons text-[18px] ${color}`}>{icon}</span>
    <span className="text-[12px] whitespace-nowrap text-slate-700 dark:text-slate-300">{label}</span>
  </button>
);

// 5. Ribbon btnIcon (16x16)
export const RibbonBtnIcon = ({ icon, onClick }: any) => (
  <button onClick={onClick} className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
    <span className="material-icons text-[16px] block">{icon}</span>
  </button>
);

// 6. Ribbon Check
export const RibbonCheck = ({ label, checked }: any) => (
  <label className="flex items-center space-x-2 cursor-pointer px-2">
    <input type="checkbox" defaultChecked={checked} className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-0" />
    <span className="text-[12px] text-slate-700 dark:text-slate-300">{label}</span>
  </label>
);

// 7. Ribbon Radio
export const RibbonRadio = ({ label, name }: any) => (
  <label className="flex items-center space-x-2 cursor-pointer px-2">
    <input type="radio" name={name} className="w-3.5 h-3.5 border-slate-300 text-blue-600 focus:ring-0" />
    <span className="text-[12px] text-slate-700 dark:text-slate-300">{label}</span>
  </label>
);

// 8. Ribbon Combo
export const RibbonCombo = ({ options }: { options: string[] }) => (
  <select className="text-[12px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500">
    {options.map(opt => <option key={opt}>{opt}</option>)}
  </select>
);