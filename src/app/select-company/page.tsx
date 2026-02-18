import { getCurrentUser } from "@/modules/auth/session";
import { getCompaniesAction } from "@/modules/companies/actions";
import { Building2, Grid, List, Bell, HelpCircle, History, ArrowRight } from "lucide-react";
import Link from "next/link";
import { AddCompanyCard } from "@/modules/companies/add-company-card";
import { SearchAndLayoutToggles } from "./search-controls"

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; view?: string }>;
}) {
  // 1. Obtener datos del servidor
  const user = await getCurrentUser();
  const { q, view } = await searchParams;
  const isListView = view === "list";

  const companiesResponse = await getCompaniesAction();
  let companies = companiesResponse.success ? companiesResponse.companies : [];

  // 2. Lógica de Filtrado en el Servidor
  if (q) {
    const searchTerm = q.toLowerCase();
    companies = companies.filter((c: any) =>
      c.name.toLowerCase().includes(searchTerm) ||
      c.rif?.toLowerCase().includes(searchTerm)
    );
  }

  // Iniciales del usuario
  const initials = user?.realName
    ? user.realName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.username?.slice(0, 2).toUpperCase() || "??";

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f7f8] dark:bg-[#101922] font-sans antialiased">
      {/* --- Navbar --- */}
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 h-16 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#137fec] rounded flex items-center justify-center text-white shadow-sm">
              <Grid size={20} />
            </div>
            <div className="hidden md:block leading-tight">
              <h1 className="text-sm font-bold tracking-tight text-gray-900 dark:text-white leading-none">AgentERP</h1>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Business Central</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:text-[#137fec] transition-colors rounded-full hover:bg-gray-100"><Bell size={20} /></button>
            <button className="p-2 text-gray-500 hover:text-[#137fec] transition-colors rounded-full hover:bg-gray-100"><HelpCircle size={20} /></button>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

            <div className="flex items-center gap-2 pl-2 group">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">{user?.realName || user?.username}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-tighter">Conectado</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-[#137fec] text-white flex items-center justify-center border-2 border-white shadow-sm font-bold text-xs uppercase">
                {initials}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-6xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Seleccionar entorno</h2>
          <p className="text-gray-500 dark:text-gray-400">Bienvenido de nuevo. Elija la organización para comenzar.</p>
        </div>

        {/* --- Controles (Buscador y Toggles de Vista) --- */}
        <SearchAndLayoutToggles currentQuery={q} currentView={view} />

        {/* --- Renderizado Condicional de Empresas --- */}
        {!isListView ? (
          /* VISTA GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {companies.map((company: any) => (
              <Link key={company.id} href={`/dashboard/${company.id}/overview`}>
                <div className="group relative bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#137fec]/50 shadow-sm p-6 cursor-pointer transition-all hover:-translate-y-1 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#137fec] to-blue-700 flex items-center justify-center text-white shadow-md">
                      <Building2 size={24} />
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 uppercase">Producción</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#137fec] transition-colors line-clamp-1">{company.name}</h3>
                  <p className="text-xs font-mono text-gray-400 mb-6 uppercase tracking-tight">RIF: {company.rif}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-[10px] text-gray-400 flex items-center gap-1"><History size={12} /> Activo ahora</span>
                    <span className="text-sm font-semibold text-[#137fec] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Entrar <ArrowRight size={14} /></span>
                  </div>
                </div>
              </Link>
            ))}
            <div className="h-full min-h-55"><AddCompanyCard /></div>
          </div>
        ) : (
          /* VISTA LISTA (Estilo Business Central) */
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm animate-in slide-in-from-bottom-2 duration-500">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <tr className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">
                  <th className="px-6 py-4">Empresa</th>
                  <th className="px-6 py-4">Identificación / RIF</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {companies.map((company: any) => (
                  <tr key={company.id} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-blue-50 dark:bg-slate-700 flex items-center justify-center text-[#137fec]">
                          <Building2 size={16} />
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white">{company.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-400">{company.rif || '---'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-green-100 text-green-700 uppercase">Producción</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/dashboard/${company.id}/overview`} className="text-[#137fec] hover:underline font-bold text-xs inline-flex items-center gap-1">
                        Entrar <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <footer className="mt-auto py-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 AgentERP Business Central</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#137fec] transition-colors">Soporte</a>
            <a href="#" className="hover:text-[#137fec] transition-colors">Privacidad</a>
          </div>
        </div>
      </footer>
    </div>
  );
}