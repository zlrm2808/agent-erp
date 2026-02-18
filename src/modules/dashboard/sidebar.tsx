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
  User as UserIcon,
  Calendar,
  Building2,
  ChevronDown,
  ChevronsUpDown,
  Home,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logoutAction } from "@/modules/auth/logout-action";
import type { User } from "@prisma/client";

const menuCategories = (companyId: string) => [
  {
    title: "Home",
    icon: Home,
    items: [
      { label: "Role Center", href: `/dashboard/${companyId}/overview`, icon: LayoutDashboard },
    ]
  },
  {
    title: "Módulos",
    icon: Box,
    items: [
      { label: "Inventario", href: `/dashboard/${companyId}/inventory`, icon: Box },
      { label: "Reportes", href: `/dashboard/${companyId}/reports`, icon: TrendingUp },
    ]
  },
  {
    title: "Administración",
    icon: Users,
    items: [
      { label: "Clientes", href: `/dashboard/${companyId}/customers`, icon: Users },
      { label: "Configuración", href: `/dashboard/${companyId}/settings`, icon: Settings },
    ]
  }
];

export function Sidebar({ companyId, user }: { companyId: string; user: User | null }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openCategories, setOpenCategories] = useState<string[]>(["Home", "Módulos"]);

  const categories = menuCategories(companyId);

  const toggleCategory = (title: string) => {
    setOpenCategories(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <aside
      className={cn(
        "relative h-[calc(100vh-48px)] bg-[#f6f6f6] border-r border-[#d2d0ce] transition-all duration-300 flex flex-col z-40 shrink-0 mt-12",
        isCollapsed ? "w-12" : "w-65"
      )}
    >
      {/* Navigation Section */}
      <nav className="flex-1 overflow-y-auto py-2 bc-scrollbar">
        {categories.map((category) => {
          const isOpen = openCategories.includes(category.title);

          return (
            <div key={category.title} className="mb-1">
              {/* Header de Categoría (Estilo BC) */}
              <button
                onClick={() => !isCollapsed && toggleCategory(category.title)}
                className={cn(
                  "w-full flex items-center px-4 py-2 text-[#323130] hover:bg-[#ebebeb] transition-colors group",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <category.icon className={cn("shrink-0 size-5 text-[#605e5c] group-hover:text-[#323130]", !isCollapsed && "mr-3")} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left text-sm font-semibold">{category.title}</span>
                    <ChevronDown className={cn("size-4 text-[#605e5c] transition-transform", isOpen ? "" : "-rotate-90")} />
                  </>
                )}
              </button>

              {/* Items de Categoría */}
              {(!isCollapsed && isOpen) && (
                <div className="mt-1">
                  {category.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "block pl-12 pr-4 py-2 text-sm transition-colors border-l-4",
                          isActive
                            ? "border-[#0078d4] bg-[#eff6fc] text-[#323130] font-medium"
                            : "border-transparent text-[#323130] hover:bg-[#ebebeb]"
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Sección Favoritos (Estilo visual BC) */}
        {!isCollapsed && (
          <div className="mt-4 px-4 py-2 border-t border-[#d2d0ce]">
            <h3 className="text-[11px] font-bold text-[#605e5c] uppercase mb-2 tracking-wider">Favoritos</h3>
            <ul className="space-y-1">
              <li className="text-sm text-[#323130] hover:underline cursor-pointer py-1">Historial de Ventas</li>
              <li className="text-sm text-[#323130] hover:underline cursor-pointer py-1">Stock Crítico</li>
            </ul>
          </div>
        )}
      </nav>

      {/* Botón de Colapso (Flotante) */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-4 h-6 w-6 rounded-full bg-white text-[#323130] border border-[#d2d0ce] shadow-sm z-50 p-0 hover:bg-[#f3f2f1]"
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
              <Avatar className="h-7 w-7 border border-[#d2d0ce] shrink-0">
                <AvatarFallback className="bg-[#c7e0f4] text-[#005a9e] text-[10px] font-bold">
                  {user?.realName?.[0] || "U"}
                </AvatarFallback>
              </Avatar>

              {!isCollapsed && (
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-[12px] font-semibold text-[#323130] truncate leading-tight">
                    {user?.realName || "Usuario"}
                  </p>
                  <p className="text-[10px] text-[#605e5c] truncate">
                    Online
                  </p>
                </div>
              )}
              {!isCollapsed && <ChevronsUpDown className="h-3 w-3 text-[#605e5c]" />}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56" align={isCollapsed ? "center" : "start"} side="right" sideOffset={10}>
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/select-company" className="cursor-pointer">
                <Building2 className="mr-2 h-4 w-4" /> Cambiar Empresa
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Calendar className="mr-2 h-4 w-4" /> Período Contable
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}