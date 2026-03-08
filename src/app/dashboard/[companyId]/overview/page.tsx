import { StatsCard } from "@/modules/dashboard/stats-card";
import { Package, TrendingUp, TriangleAlert, History, MapPin, CalendarClock } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyRepository } from "@/modules/companies/repository";
import { InventoryRepository } from "@/modules/inventory/repository";
import { getSystemDate } from "@/lib/system-date";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import * as R from "@/components/ui/MicrosoftRibbon";

export default async function OverviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ companyId: string }>;
  searchParams: Promise<{ branchId?: string }>;
}) {
  const { companyId } = await params;
  const { branchId } = await searchParams;
  const base = `/dashboard/${companyId}`;

  const [company, stats, recentMovements, systemDate] = await Promise.all([
    CompanyRepository.findById(companyId),
    InventoryRepository.getDashboardStats(companyId, branchId),
    InventoryRepository.getRecentMovements(companyId, branchId, 8),
    getSystemDate(),
  ]);

  return (
    <div className="space-y-0 -m-6 flex flex-col h-full overflow-hidden">
      <R.RibbonContainer>
        <div className="flex items-stretch overflow-x-auto no-scrollbar">
          <R.RibbonGroup label="Gestionar">
            <R.RibbonBtnLarge icon="ReceiptText" label="Nueva Factura" href={`${base}/sales/invoices`} />
            <R.RibbonBtnLarge icon="Box" label="Productos" href={`${base}/inventory`} />
            <R.RibbonBtnLarge icon="BadgeCent" label="Nómina" href={`${base}/payroll`} />
          </R.RibbonGroup>
          <R.RibbonGroup label="Configuración">
            <R.RibbonBtnLarge icon="Users" label="Usuarios" href={`${base}/settings/users`} />
            <R.RibbonBtnLarge icon="CalendarClock" label="Fecha Sistema" href={`${base}/settings/system-date`} />
          </R.RibbonGroup>
        </div>
      </R.RibbonContainer>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold tracking-tight text-[#323130]">{company?.name ?? "Empresa"}</h2>
            <div className="flex items-center gap-3 text-[#605e5c] text-xs">
              <span className="font-mono bg-white px-2 py-0.5 border border-[#e1dfdd]">RIF: {company?.rif ?? "-"}</span>
              <div className="flex items-center gap-1">
                <MapPin size={12} />
                <span className="truncate max-w-[300px]">{company?.address ?? "Dirección no registrada"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-sm shadow-sm group">
            <CalendarClock size={16} className="text-[#0078d4] group-hover:scale-110 transition-transform" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-[#0078d4] uppercase leading-none">Fecha de Trabajo</span>
              <span className="text-xs font-bold text-[#323130] capitalize">
                {format(systemDate, "PPPP", { locale: es })}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-px bg-[#e1dfdd] border border-[#e1dfdd] md:grid-cols-2 lg:grid-cols-4 shadow-sm overflow-hidden rounded-sm">
          <StatsCard title="Productos" value={stats.totalProducts.toString()} description="registros activos" icon={Package} />
          <StatsCard
            title="Valor Inventario"
            value={`$${stats.totalValue.toLocaleString("es-VE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`}
            description="costo total"
            icon={TrendingUp}
          />
          <StatsCard title="Stock Bajo" value={stats.lowStock.toString()} description="requieren atención" icon={TriangleAlert} />
          <StatsCard
            title="Sin Movimientos"
            value={stats.inactiveProducts.toString()}
            description="últimos 60 días"
            icon={History}
          />
        </div>

        <Card className="border-[#e1dfdd] shadow-none rounded-none mt-8">
          <CardHeader className="py-3 border-b border-[#e1dfdd] bg-[#faf9f8]">
            <CardTitle className="text-sm font-bold text-[#323130]">Actividad reciente de inventario</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {recentMovements.length === 0 ? (
              <p className="text-sm text-[#605e5c]">No hay movimientos recientes para esta empresa.</p>
            ) : (
              <div className="space-y-2 text-sm">
                {recentMovements.map((movement) => (
                  <div key={movement.id} className="flex items-center justify-between border-b border-[#f3f2f1] pb-2">
                    <span>{movement.product.name} ({movement.product.sku})</span>
                    <span className="text-[#605e5c]">{movement.type} · {movement.quantity} · {new Date(movement.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
