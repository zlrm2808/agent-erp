import { Button } from "@/components/ui/button";
import {
  Bell,
  Search,
  Grid3X3,
  Menu,
  Settings,
  CircleHelp
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Breadcrumb } from "@/components/ui/TheBreadcrumb";

export function Topbar() {
  return (
    <header className="h-12 bg-[#001d3d] text-white flex items-center justify-between px-2 fixed top-0 left-0 right-0 z-50 shadow-sm">
      {/* Left: Brand & Business Unit */}
      <div className="flex items-center h-full">
        <Button variant="ghost" size="icon" className="h-9 w-9 p-2 hover:bg-white/10 rounded-sm mr-1 text-white">
          <Grid3X3 className="w-5 h-5" />
        </Button>

        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="h-9 w-9 p-2 hover:bg-white/10 rounded-sm mr-2 text-white">
            <Menu className="w-5 h-5" />
          </Button>

          {/* Nombre de Empresa y Sucursal */}
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-sm tracking-wide">
              Avícola la Providencia
            </span>
            <span className="text-white/40 font-light">|</span>
            <span className="text-sm font-light text-gray-200">
              Planta Beneficio
            </span>
          </div>
          <Breadcrumb />
        </div>

        {/* Breadcrumb optimizado para navegación interna opcional */}
        <div className="hidden lg:flex items-center ml-8 text-sm">
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-xl mx-4 hidden md:block">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-white/70 group-focus-within:text-[#001d3d]" />
          </div>
          <Input
            placeholder="Dígame qué desea hacer"
            className="block w-full pl-10 pr-12 py-1.5 text-sm bg-white/10 text-white placeholder-gray-300 border-none rounded-md focus:outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-500 transition-colors h-8"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-400 text-[10px] font-medium">Alt+Q</span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="icon" className="h-9 w-9 p-2 hover:bg-white/10 rounded-sm relative text-white">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-orange-500 ring-1 ring-[#001d3d]" />
        </Button>

        <Button variant="ghost" size="icon" className="h-9 w-9 p-2 hover:bg-white/10 rounded-sm text-white">
          <Settings className="w-4 h-4" />
        </Button>

        <Button variant="ghost" size="icon" className="h-9 w-9 p-2 hover:bg-white/10 rounded-sm text-white">
          <CircleHelp className="w-4 h-4" />
        </Button>

        <div className="ml-2 pl-2 border-l border-white/20 flex items-center cursor-pointer hover:bg-white/10 p-1 rounded-sm transition-colors">
          <div className="w-7 h-7 rounded-full bg-sky-200 text-[#001d3d] flex items-center justify-center text-xs font-bold border border-white/50">
            AP
          </div>
        </div>
      </div>
    </header>
  );
}