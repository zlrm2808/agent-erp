import { InventoryRepository } from "@/modules/inventory/repository";
import * as R from "@/components/ui/MicrosoftRibbon";
import { File, Edit, Trash, ArrowUpFromDot, ArrowDownToDot, List, Package, BoxesIcon } from "lucide-react";
import { KpiCard } from "@/components/ui/KpiCard";

export default async function InventoryPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;
  const [stats, recentMovements] = await Promise.all([
    InventoryRepository.getDashboardStats(companyId),
    InventoryRepository.getRecentMovements(companyId),
  ]);

  return (
    <div className="space-y-0 mt-12">
      <R.RibbonContainer>
        <R.RibbonMenu>
          <R.RibbonTab label="Home" />
        </R.RibbonMenu>
        <div className="flex h-24 overflow-x-auto no-scrollbar items-stretch">
          <R.RibbonGroup label="Productos">
            <R.RibbonBtnLarge icon={File} label="Nuevo" />
            <div className="flex-col">
              <R.RibbonBtnSmall icon={Edit} label="Editar" color="text-green-900" />
              <R.RibbonBtnSmall icon={Trash} label="Eliminar" color="text-red-900" />
            </div>
          </R.RibbonGroup>
          <R.RibbonGroup label="Movimientos">
            <R.RibbonBtnLarge icon={ArrowDownToDot} label="Entradas" />
            <R.RibbonBtnLarge icon={ArrowUpFromDot} label="Salidas" />
          </R.RibbonGroup>
          <R.RibbonGroup label="Ver">
            <R.RibbonBtnLarge icon={List} label="Productos" />
            <div className="flex-col">
              <R.RibbonBtnSmall icon={Package} label="Stock" color="text-green-900" />
              <R.RibbonBtnSmall icon={BoxesIcon} label="Kardex" color="text-blue-700" />
            </div>
          </R.RibbonGroup>
        </div>
      </R.RibbonContainer>

      <div className="py-3 space-y-3">
        <div className="flex justify-between gap-3">
          <KpiCard
            titulo="Total de Productos"
            contenido={stats.totalProducts.toString()}
            descripcion="Items registrados en el sistema"
            color="#0078d4"
          />
          <KpiCard
            titulo="Valor Total de Inventario"
            contenido={`$${stats.totalValue.toLocaleString("es-VE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`}
            descripcion="Costo total del inventario actual"
            color="green"
          />
          <KpiCard
            titulo="Alerta de Stock"
            contenido={stats.lowStock.toString()}
            descripcion="Items por debajo del stock mínimo"
            color="red"
          />
          <KpiCard
            titulo="Items sin movimientos"
            contenido={stats.inactiveProducts.toString()}
            descripcion="Items inactivos en los últimos 60 días"
            color="orange"
          />
        </div>

        <div className="rounded-lg border border-[#e1dfdd] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#323130]">Movimientos Recientes</h3>
          </div>

          {recentMovements.length === 0 ? (
            <div className="rounded-md border border-dashed border-[#e1dfdd] p-8 text-center bg-[#faf9f8]">
              <p className="text-sm text-[#605e5c]">No hay movimientos registrados recientes.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e1dfdd] text-left text-[#605e5c]">
                    <th className="py-2 pr-4">Fecha</th>
                    <th className="py-2 pr-4">Producto</th>
                    <th className="py-2 pr-4">Tipo</th>
                    <th className="py-2 pr-4">Cantidad</th>
                    <th className="py-2 pr-4">Usuario</th>
                  </tr>
                </thead>
                <tbody>
                  {recentMovements.map((movement) => (
                    <tr key={movement.id} className="border-b border-[#f3f2f1]">
                      <td className="py-2 pr-4">{new Date(movement.createdAt).toLocaleString()}</td>
                      <td className="py-2 pr-4">{movement.product.name} ({movement.product.sku})</td>
                      <td className="py-2 pr-4">{movement.type}</td>
                      <td className="py-2 pr-4">{movement.quantity}</td>
                      <td className="py-2 pr-4">{movement.user.username}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
