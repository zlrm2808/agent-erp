import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Topbar() {
    return (
        <header className="h-12 bg-[#001d3d] text-white sticky top-0 z-30 flex items-center px-6 shadow-md">
            {/* Left: Breadcrumb */}
            <div className="flex items-center flex-1">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard" className="text-white/70 hover:text-white text-xs">
                                Inicio
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-white/40" />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-white text-xs font-medium">
                                Dashboard
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Center: Search Bar */}
            <div className="flex items-center justify-center flex-1">
                <div className="relative max-w-md w-full hidden md:block">
                    <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-white/50" />
                    <Input
                        placeholder="Buscar en Dynamics ERP..."
                        className="pl-9 bg-white/10 border-none text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-primary/50 h-8 text-xs"
                    />
                </div>
            </div>

            {/* Right: Notifications */}
            <div className="flex items-center gap-2 flex-1 justify-end">
                <Button variant="ghost" size="icon" className="h-8 w-8 relative text-white/70 hover:bg-white/10 hover:text-white">
                    <Bell size={18} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#001d3d]" />
                </Button>
            </div>
        </header>
    );
}
