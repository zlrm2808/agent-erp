import { InventoryRepository } from "@/modules/inventory/repository";
import { InventoryStats } from "@/modules/inventory/components/inventory-stats";
import { Ribbon, RibbonGroup, RibbonButton } from "@/components/ui/ribbon";

export default async function InventoryPage({
  params,
}: {
  params: Promise<{ companyId: string }>
}) {
  const { companyId } = await params;
  const stats = await InventoryRepository.getDashboardStats(companyId);

  return (
    <div className="space-y-0">
      {/* Ribbon */}
      <Ribbon
        title="Inventario"
        description="Gestión de productos, existencias y movimientos"
      >
        <RibbonGroup title="Nuevo">
          <RibbonButton
            icon="Plus"
            label="Producto"
            href={`/dashboard/${companyId}/inventory/products/new`}
            variant="primary"
          />
        </RibbonGroup>

        <RibbonGroup title="Movimientos">
          <RibbonButton
            icon="ArrowUp"
            label="Entrada"
            href={`/dashboard/${companyId}/inventory/movements/new?type=IN`}
          />
          <RibbonButton
            icon="ArrowDown"
            label="Salida"
            href={`/dashboard/${companyId}/inventory/movements/new?type=OUT`}
          />
        </RibbonGroup>

        <RibbonGroup title="Ver">
          <RibbonButton
            icon="List"
            label="Productos"
            href={`/dashboard/${companyId}/inventory/products`}
          />
          <RibbonButton
            icon="Package"
            label="Stock"
            href={`/dashboard/${companyId}/inventory`}
          />
        </RibbonGroup>
      </Ribbon>

      {/* Content */}
      <div className="py-3 space-y-3">

        {/* Stats */}
        <InventoryStats stats={stats} />

        {/* Recent Movements Placeholder */}
        <div className="rounded-lg border border-[#e1dfdd] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#323130]">Movimientos Recientes</h3>
            <a href="#" className="text-primary text-sm font-semibold hover:underline">Ver todo</a>
          </div>
          <div className="rounded-md border border-dashed border-[#e1dfdd] p-8 text-center bg-[#faf9f8]">
            <p className="text-sm text-[#605e5c]">
              No hay movimientos registrados recientes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
