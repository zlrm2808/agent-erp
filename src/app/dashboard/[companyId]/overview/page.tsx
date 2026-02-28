import { StatsCard } from "@/modules/dashboard/stats-card";
import { Package, TrendingUp, TriangleAlert, History, Building2, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyRepository } from "@/modules/companies/repository";
import { InventoryRepository } from "@/modules/inventory/repository";

export default async function OverviewPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;

  const [company, stats, recentMovements] = await Promise.all([
    CompanyRepository.findById(companyId),
    InventoryRepository.getDashboardStats(companyId),
    InventoryRepository.getRecentMovements(companyId, 8),
  ]);

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center gap-1 -mx-6 -mt-6 bg-[#f3f2f1] px-4 h-10 border-b border-[#e1dfdd]">
        <div className="px-4 h-full flex items-center gap-2 bg-white border-x border-t border-[#e1dfdd] text-xs font-semibold text-[#001d3d] rounded-t-sm">
          <Building2 size={14} />
          Resumen
        </div>
      </div>

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

      <Card className="border-[#e1dfdd] shadow-none rounded-none">
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
  );
}
