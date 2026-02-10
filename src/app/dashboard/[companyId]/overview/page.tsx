import { StatsCard } from "@/modules/dashboard/stats-card";
import {
    DollarSign,
    Package,
    ShoppingCart,
    TrendingUp,
    Clock,
    History,
    Building2,
    MapPin
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CompanyRepository } from "@/modules/companies/repository";
import { getCurrentUser } from "@/modules/auth/session";
export default async function OverviewPage({
    params
}: {
    params: Promise<{ companyId: string }>
}) {
    const { companyId } = await params;
    const user = await getCurrentUser();

    // Fetch real company data
    let company = null;
    if (companyId) {
        company = await CompanyRepository.findById(companyId);
    }

    if (!company && user) {
        const allCompanies = await CompanyRepository.findByUserId(user.id);
        company = allCompanies[0];
    }

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            {/* Workplace Ribbon Placeholder */}
            <div className="flex items-center gap-1 -mx-6 -mt-6 bg-[#f3f2f1] px-4 h-10 border-b border-[#e1dfdd]">
                <div className="px-4 h-full flex items-center gap-2 bg-white border-x border-t border-[#e1dfdd] text-xs font-semibold text-[#001d3d] rounded-t-sm">
                    <Building2 size={14} />
                    Resumen
                </div>
                <div className="px-4 h-full flex items-center gap-2 text-[#605e5c] text-xs hover:bg-[#edebe9] transition-colors cursor-pointer">
                    Ventas
                </div>
                <div className="px-4 h-full flex items-center gap-2 text-[#605e5c] text-xs hover:bg-[#edebe9] transition-colors cursor-pointer">
                    Inventario
                </div>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
                <div className="space-y-0.5">
                    <h2 className="text-xl font-bold tracking-tight text-[#323130]">
                        {company?.name || "Empresa Demo"}
                    </h2>
                    <div className="flex items-center gap-3 text-[#605e5c] text-xs">
                        <span className="font-mono bg-white px-2 py-0.5 border border-[#e1dfdd]">RIF: {company?.rif || "J-00000000-0"}</span>
                        <div className="flex items-center gap-1">
                            <MapPin size={12} />
                            <span className="truncate max-w-[300px]">{company?.address || "Dirección no registrada"}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs font-bold bg-white border-[#e1dfdd] text-[#323130] hover:bg-[#f3f2f1]">
                        Editar reporte
                    </Button>
                    <div className="h-8 w-px bg-[#e1dfdd] mx-2 hidden md:block" />
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] text-[#605e5c] font-medium leading-tight">Última actualización</p>
                        <p className="text-[11px] font-bold text-[#323130]">{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid - Fluent Style */}
            <div className="grid gap-px bg-[#e1dfdd] border border-[#e1dfdd] md:grid-cols-2 lg:grid-cols-4 shadow-sm overflow-hidden rounded-sm">
                <StatsCard
                    title="Ventas Totales"
                    value="$45,231.89"
                    trend={{ value: "20.1%", isUp: true }}
                    description="vs mes anterior"
                    icon={DollarSign}
                />
                <StatsCard
                    title="Órdenes"
                    value="2,350"
                    trend={{ value: "180.1%", isUp: true }}
                    description="vs ayer"
                    icon={ShoppingCart}
                />
                <StatsCard
                    title="Stock Bajo"
                    value="12"
                    description="requieren atención"
                    icon={Package}
                />
                <StatsCard
                    title="Eficiencia"
                    value="94%"
                    trend={{ value: "4.1%", isUp: false }}
                    description="vs objetivo"
                    icon={TrendingUp}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 pt-4">
                <Card className="lg:col-span-4 border-[#e1dfdd] shadow-none rounded-none">
                    <CardHeader className="flex flex-row items-center justify-between py-3 border-b border-[#e1dfdd] bg-[#faf9f8]">
                        <CardTitle className="text-sm font-bold text-[#323130]">Ventas Recientes</CardTitle>
                        <Button variant="ghost" className="h-8 text-primary hover:bg-primary/5 text-[10px] font-bold uppercase tracking-widest">
                            Ver reporte completo
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#f3f2f1] text-[#605e5c] font-bold">
                                <tr>
                                    <th className="px-4 py-2 border-b border-[#e1dfdd]">ID</th>
                                    <th className="px-4 py-2 border-b border-[#e1dfdd]">Cliente</th>
                                    <th className="px-4 py-2 border-b border-[#e1dfdd]">Fecha</th>
                                    <th className="px-4 py-2 border-b border-[#e1dfdd] text-right">Monto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i} className="hover:bg-[#faf9f8] transition-colors border-b border-[#e1dfdd]/50">
                                        <td className="px-4 py-3 font-medium text-primary">#100{i}</td>
                                        <td className="px-4 py-3 text-[#323130]">Inversiones Cliente {i}</td>
                                        <td className="px-4 py-3 text-[#605e5c]">08/02/2026</td>
                                        <td className="px-4 py-3 text-right font-bold text-[#323130]">$125.00</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3 border-[#e1dfdd] shadow-none rounded-none bg-[#001d3d] text-white">
                    <CardHeader className="py-3 border-b border-white/10">
                        <CardTitle className="text-sm font-bold text-white">Centro de Notificaciones</CardTitle>
                    </CardHeader>
                    <CardContent className="py-4">
                        <div className="space-y-4">
                            <p className="text-[11px] text-white/60">Resumen de alertas críticas y vencimientos.</p>
                            <div className="space-y-px bg-white/5 border border-white/10 rounded-sm">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="p-3 hover:bg-white/10 transition-colors border-b border-white/10 last:border-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] font-bold uppercase text-white/40">Alerta - Proveedor {i} </span>
                                            <span className="text-[10px] text-rose-400 font-bold bg-rose-400/10 px-1.5 py-0.5 rounded-sm">Vence pronto</span>
                                        </div>
                                        <div className="text-md font-bold text-white">$2,450.00</div>
                                    </div>
                                ))}
                            </div>
                            <Button className="w-full h-8 mt-2 bg-primary text-white hover:bg-primary/90 text-xs font-bold rounded-sm">
                                Abrir Tesorería
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
