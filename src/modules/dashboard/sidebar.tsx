"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Box,
  ShoppingCart,
  Users,
  Receipt,
  Settings,
  X,
  Menu,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  LogOut,
  User as UserIcon,
  Calendar,
  Building2,
  Briefcase,
  MoreHorizontal,
  ChevronsUpDown,
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
    title: "Principal",
    items: [
      { icon: LayoutDashboard, label: "Panel Principal", href: `/dashboard/${companyId}/overview` },
      { icon: TrendingUp, label: "Reportes", href: `/dashboard/${companyId}/reports` },
    ]
  },
  {
    title: "Módulos",
    items: [
      { icon: Box, label: "Inventario", href: `/dashboard/${companyId}/inventory` },
    ]
  },
  {
    title: "Administración",
    items: [
      { icon: Users, label: "Clientes", href: `/dashboard/${companyId}/customers` },
      { icon: Settings, label: "Configuración", href: `/dashboard/${companyId}/settings` },
    ]
  }
];

export function Sidebar({ companyId, user }: { companyId: string; user: User | null }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const categories = menuCategories(companyId);

  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <aside
      className={cn(
        "relative h-screen bg-[#f3f2f1] text-[#323130] transition-all duration-300 flex flex-col z-40 border-r border-[#e1dfdd]",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Brand Section */}
      <div className="h-12 flex items-center px-4 border-b border-[#e1dfdd] shrink-0 bg-white">
        {!isCollapsed && (
          <span className="text-lg font-bold tracking-tight text-[#001d3d]">
            Agent<span className="text-primary">ERP</span>
          </span>
        )}
        {isCollapsed && (
          <span className="text-lg font-bold text-primary mx-auto">A</span>
        )}
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-slate-200">
        {categories.map((category, catIdx) => (
          <div key={catIdx} className="mb-4">
            <div className={cn(
              "px-5 py-2 text-[10px] font-bold text-[#605e5c] uppercase tracking-wider transition-opacity duration-300 min-h-[32px] overflow-hidden whitespace-nowrap",
              isCollapsed ? "opacity-0" : "opacity-100"
            )}>
              {category.title}
            </div>
            <ul className="space-y-0.5 px-2">
              {category.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group",
                        isActive
                          ? "bg-white text-[#001d3d] shadow-sm border border-[#e1dfdd] font-bold"
                          : "text-[#323130] hover:bg-[#edebe9]"
                      )}
                    >
                      <item.icon className={cn("shrink-0 size-5", isActive ? "text-primary" : "text-[#605e5c]")} strokeWidth={isActive ? 2.5 : 2} />
                      {!isCollapsed && (
                        <span className="text-[13px]">{item.label}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
            {catIdx < categories.length - 1 && (
              <div className={cn(
                "mx-4 my-2 border-t border-[#e1dfdd]/50 transition-opacity duration-300",
                isCollapsed ? "opacity-0" : "opacity-100"
              )} />
            )}
          </div>
        ))}
      </nav>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-14 h-6 w-6 rounded-full bg-white text-[#323130] hover:bg-[#f3f2f1] border border-[#e1dfdd] shadow-sm z-50 p-0"
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </Button>

      {/* Footer Section - User Profile */}
      <div className="border-t border-[#e1dfdd] p-2 bg-white mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full flex items-center gap-3 p-2 h-auto hover:bg-[#f3f2f1] rounded-md transition-colors border border-transparent hover:border-ring outline-none",
                isCollapsed ? "justify-center px-0" : "justify-start"
              )}
            >
              <Avatar className="h-8 w-8 border border-[#e1dfdd] shrink-0">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                  {user?.realName?.[0] || user?.username?.[0] || "U"}
                </AvatarFallback>
              </Avatar>

              {!isCollapsed && (
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-[12px] font-bold text-[#323130] truncate">
                    {user?.realName || user?.username || "Usuario"}
                  </p>
                  <p className="text-[10px] text-[#605e5c] truncate">
                    {user?.username}
                  </p>
                </div>
              )}

              {!isCollapsed && (
                <ChevronsUpDown className="h-4 w-4 text-[#605e5c] shrink-0" />
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-56"
            align="start"
            alignOffset={isCollapsed ? 50 : 0}
            sideOffset={8}
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.realName || "Usuario"}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.username}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Seleccionar Fecha</span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/select-company" className="w-full cursor-pointer">
                <Building2 className="mr-2 h-4 w-4" />
                <span>Seleccionar Empresa</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Editar Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {!isCollapsed && (
          <div className="mt-2 text-[9px] text-[#a19f9d] font-medium text-center uppercase tracking-tight">
            v1.2.0 • Dynamics Theme
          </div>
        )}
      </div>
    </aside>
  );
}
