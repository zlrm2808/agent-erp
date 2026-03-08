"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Box,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  LogOut,
  Building2,
  ChevronDown,
  ChevronsUpDown,
  Home,
  ReceiptText,
  BadgeCent,
  ArrowLeft,
  FileText,
  CreditCard,
  UserPlus,
  Package,
  History,
  ShieldCheck,
  Calculator,
  PlusCircle,
  CalendarClock,
  UserCircle,
  Grid2X2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logoutAction } from "@/modules/auth/logout-action";
import { useUIPersistence } from "@/components/providers/ui-persistence-provider";
import { Eye, EyeOff } from "lucide-react";
import type { User } from "@prisma/client";

// Module Definitions
const MODULES = {
  GENERAL: "general",
  SALES: "sales",
  INVENTORY: "inventory",
  PAYROLL: "payroll",
};

interface SidebarProps {
  companyId: string;
  user: any; // We use any to avoid strict Prisma type issues across modules
}

export function Sidebar({ companyId, user }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { showBreadcrumb, setShowBreadcrumb } = useUIPersistence();

  // Detect Current Module
  const currentModule = useMemo(() => {
    if (pathname.includes("/sales")) return MODULES.SALES;
    if (pathname.includes("/inventory")) return MODULES.INVENTORY;
    if (pathname.includes("/payroll")) return MODULES.PAYROLL;
    return MODULES.GENERAL;
  }, [pathname]);

  // Sidebar configurations per module
  const menuConfig = useMemo(() => {
    const base = `/dashboard/${companyId}`;

    switch (currentModule) {
      case MODULES.SALES:
        return {
          title: "Ventas",
          icon: ReceiptText,
          color: "text-emerald-600",
          items: [
            { label: "Facturación", href: `${base}/sales/invoices`, icon: FileText },
            { label: "Clientes", href: `${base}/customers`, icon: Users },
            { label: "Reportes Fiscales", href: `${base}/reports/sales`, icon: TrendingUp },
          ],
        };
      case MODULES.INVENTORY:
        return {
          title: "Inventario",
          icon: Box,
          color: "text-amber-600",
          items: [
            { label: "Productos", href: `${base}/inventory`, icon: Package },
            { label: "Movimientos", href: `${base}/inventory/movements`, icon: TrendingUp },
            { label: "Ajustes", href: `${base}/inventory/adjustments`, icon: Settings },
          ],
        };
      case MODULES.PAYROLL:
        return {
          title: "Nómina",
          icon: BadgeCent,
          color: "text-blue-600",
          items: [
            { label: "Procesamiento", href: `${base}/payroll?view=processing`, icon: Calculator },
            { label: "Personal", href: `${base}/payroll?view=employees`, icon: UserPlus },
            { label: "Historial", href: `${base}/payroll?view=history`, icon: History },
            { label: "Prestaciones", href: `${base}/payroll?view=benefits`, icon: ShieldCheck },
            { label: "Parámetros", href: `${base}/payroll/settings`, icon: Settings },
          ],
        };
      default:
        // MAIN MENU (GENERAL)
        const role = user?.membership?.role;
        const isAdmin = role === "admin" || role === "developer";

        return {
          title: "Menú Principal",
          icon: Home,
          color: "text-[#0078d4]",
          items: [
            { label: "Role Center", href: `${base}/overview`, icon: LayoutDashboard },
            {
              label: "Módulos",
              icon: Box,
              isGroup: true,
              subItems: [
                { label: "Ventas", href: `${base}/sales/invoices`, icon: ReceiptText },
                { label: "Inventario", href: `${base}/inventory`, icon: Box },
                { label: "Nómina", href: `${base}/payroll`, icon: BadgeCent },
              ]
            },
            {
              label: "Configuración",
              icon: Settings,
              isGroup: true,
              subItems: [
                { label: "Empresas", href: `${base}/settings/companies`, icon: Building2 },
                { label: "Sucursales", href: `${base}/settings/branches`, icon: Home },
                { label: "Usuarios y Perfiles", href: `${base}/settings/users`, icon: Users },
                { label: "Fecha del Sistema", href: `${base}/settings/system-date`, icon: CalendarClock },
                ...(isAdmin ? [
                  { label: "Módulos del Sistema", href: `${base}/settings/modules`, icon: Grid2X2 }
                ] : []),
              ]
            },
          ],
        };
    }
  }, [currentModule, companyId, user]);

  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Módulos", "Configuración"]);

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <aside
      className={cn(
        "relative h-full bg-[#f3f2f1] border-r border-[#d2d0ce] transition-all duration-500 ease-in-out flex flex-col z-40 shrink-0",
        isCollapsed ? "w-12" : "w-64"
      )}
    >
      {/* Module Header / Back Button */}
      <div className="p-2">
        {currentModule !== MODULES.GENERAL && !isCollapsed && (
          <Link
            href={`/dashboard/${companyId}/overview`}
            className="flex items-center gap-2 px-2 py-1.5 text-[10px] font-bold text-[#605e5c] hover:text-[#323130] transition-colors mb-2 group"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> VOLVER AL MENÚ PRINCIPAL
          </Link>
        )}

        <div className={cn(
          "flex items-center gap-3 px-3 py-4 bg-white border border-[#e1dfdd] rounded-sm shadow-sm transition-all duration-300",
          isCollapsed ? "justify-center px-0" : "animate-in slide-in-from-left-4"
        )}>
          <div className={cn("p-2 rounded-full bg-slate-50", menuConfig.color)}>
            <menuConfig.icon size={isCollapsed ? 20 : 24} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-widest text-[#323130]">{menuConfig.title}</span>
              <span className="text-[10px] text-[#605e5c]">AGENT ERP</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 overflow-y-auto py-4 bc-scrollbar space-y-1">
        {menuConfig.items.map((item: any) => {
          const isActive = pathname === item.href || (pathname + pathname.search) === item.href;
          const isGroupExpanded = expandedGroups.includes(item.label);

          if (item.isGroup) {
            return (
              <div key={item.label} className="space-y-1">
                <button
                  onClick={() => !isCollapsed && toggleGroup(item.label)}
                  className={cn(
                    "w-full flex items-center px-4 py-2.5 text-sm font-semibold transition-all relative overflow-hidden group",
                    "text-[#323130] hover:bg-[#ebebeb]"
                  )}
                >
                  <item.icon className={cn(
                    "shrink-0 size-5 text-[#605e5c] group-hover:text-[#323130]",
                    !isCollapsed && "mr-3"
                  )} />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronDown size={14} className={cn("transition-transform duration-300", isGroupExpanded ? "" : "-rotate-90")} />
                    </>
                  )}
                </button>
                {isGroupExpanded && !isCollapsed && item.subItems && (
                  <div className="animate-in slide-in-from-top-1 duration-200">
                    {item.subItems.map((sub: any) => {
                      const isSubActive = pathname === sub.href;
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={cn(
                            "flex items-center pl-12 pr-4 py-2 text-xs transition-colors border-l-4",
                            isSubActive
                              ? "bg-[#eff6fc] text-[#0078d4] font-bold border-[#0078d4]"
                              : "text-[#605e5c] hover:bg-[#ebebeb] border-transparent"
                          )}
                        >
                          <sub.icon size={14} className="mr-3 shrink-0" />
                          <span>{sub.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center px-4 py-2.5 text-sm transition-all relative overflow-hidden",
                isActive
                  ? "bg-[#eff6fc] text-[#0078d4] font-bold"
                  : "text-[#323130] hover:bg-[#ebebeb]",
                item.isSpecial && "mt-2 pt-2 border-t border-[#e1dfdd] text-[#0078d4]/80 hover:text-[#0078d4]"
              )}
            >
              <item.icon className={cn(
                "shrink-0 size-5 transition-colors",
                isActive ? "text-[#0078d4]" : "text-[#605e5c] group-hover:text-[#323130]",
                !isCollapsed && "mr-3",
                item.isSpecial && "text-[#0078d4]"
              )} />
              {!isCollapsed && (
                <span className="flex-1 animate-in fade-in duration-500">{item.label}</span>
              )}
              {isActive && !isCollapsed && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0078d4]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Botón de Colapso (Flotante) */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-24 h-6 w-6 rounded-full bg-white text-[#323130] border border-[#d2d0ce] shadow-sm z-50 p-0 hover:bg-[#f3f2f1]"
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </Button>

      {/* User Footer Section */}
      <div className="border-t border-[#d2d0ce] p-2 bg-white mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full flex items-center gap-3 p-2 h-auto hover:bg-[#f3f2f1] rounded-sm transition-colors",
                isCollapsed ? "justify-center px-0" : "justify-start"
              )}
            >
              <Avatar className="h-9 w-9 border border-[#d2d0ce] shrink-0">
                {user?.photo ? (
                  <img src={user.photo} alt={user.realName} className="h-full w-full object-cover rounded-full" />
                ) : (
                  <AvatarFallback className="bg-[#c7e0f4] text-[#005a9e] text-xs font-black">
                    {user?.realName?.[0] || "U"}
                  </AvatarFallback>
                )}
              </Avatar>

              {!isCollapsed && (
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-[12px] font-black text-[#323130] truncate leading-tight uppercase tracking-tight">
                    {user?.realName || "Usuario del Sistema"}
                  </p>
                  <p className="text-[10px] text-[#0078d4] font-bold truncate uppercase mt-0.5">
                    {user?.position || "Consultor"}
                  </p>
                  <p className="text-[9px] text-[#605e5c] truncate uppercase">
                    {user?.department || "Administración"}
                  </p>
                </div>
              )}
              {!isCollapsed && <ChevronsUpDown className="h-3 w-3 text-[#605e5c] opacity-50" />}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-64 p-0 overflow-hidden border-[#d2d0ce] shadow-2xl animate-in slide-in-from-bottom-2 duration-200"
            align={isCollapsed ? "center" : "start"}
            side="top"
            sideOffset={12}
          >
            <div className="p-4 bg-[#faf9f8] border-b border-[#e1dfdd]">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-[#d2d0ce] shrink-0">
                  {user?.photo ? (
                    <img src={user.photo} alt={user.realName} className="h-full w-full object-cover" />
                  ) : (
                    <AvatarFallback className="bg-sky-100 text-[#0078d4] text-sm font-bold">
                      {user?.realName?.[0] || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-bold text-[#323130] truncate">
                    {user?.realName || "Usuario"}
                  </p>
                  <p className="text-[10px] text-[#0078d4] font-bold truncate">
                    {user?.position || "Consultor"}
                  </p>
                  <p className="text-[9px] text-[#605e5c] truncate">
                    {user?.department || "Administración"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-1.5 bg-white">
              <DropdownMenuSeparator className="bg-[#f3f2f1]" />
              <DropdownMenuItem asChild>
                <Link href="/select-company" className="px-3 py-2 text-xs font-semibold text-[#323130] focus:bg-[#f3f2f1] cursor-pointer rounded-sm flex items-center">
                  <Building2 className="mr-3 h-4 w-4 text-[#605e5c]" /> Cambiar Empresa
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowBreadcrumb(!showBreadcrumb)}
                className="px-3 py-2 text-xs font-semibold text-[#323130] focus:bg-[#f3f2f1] cursor-pointer rounded-sm flex items-center"
              >
                {showBreadcrumb ? (
                  <><EyeOff className="mr-3 h-4 w-4 text-[#605e5c]" /> Ocultar Navegación</>
                ) : (
                  <><Eye className="mr-3 h-4 w-4 text-[#0078d4]" /> Mostrar Navegación</>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#f3f2f1]" />
              <DropdownMenuItem onClick={handleLogout} className="px-3 py-2 text-xs font-black text-rose-600 focus:text-rose-700 focus:bg-rose-50 cursor-pointer rounded-sm flex items-center">
                <LogOut className="mr-3 h-4 w-4" /> CERRAR SESIÓN
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}