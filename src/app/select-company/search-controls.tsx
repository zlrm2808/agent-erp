"use client";

import { Search, Grid, List } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function SearchAndLayoutToggles({
  currentQuery,
  currentView
}: {
  currentQuery?: string;
  currentView?: string
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function updateParams(key: string, value: string | null) {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-3 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between border border-gray-100 dark:border-gray-700">
      {/* Input de Búsqueda */}
      <div className="relative w-full md:w-96 group">
        <Search
          className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${isPending ? "text-[#137fec] animate-pulse" : "text-gray-400"}`}
          size={18}
        />
        <input
          type="text"
          placeholder="Buscar empresa por nombre o RIF..."
          defaultValue={currentQuery}
          onChange={(e) => updateParams("q", e.target.value)}
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-[#137fec] outline-none transition-all"
        />
      </div>

      {/* Selectores de Vista */}
      <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-lg shrink-0">
        <button
          onClick={() => updateParams("view", "grid")}
          className={`p-1.5 rounded transition-all ${currentView !== 'list' ? 'bg-white shadow-sm text-[#137fec]' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Grid size={18} />
        </button>
        <button
          onClick={() => updateParams("view", "list")}
          className={`p-1.5 rounded transition-all ${currentView === 'list' ? 'bg-white shadow-sm text-[#137fec]' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <List size={18} />
        </button>
      </div>
    </div>
  );
}