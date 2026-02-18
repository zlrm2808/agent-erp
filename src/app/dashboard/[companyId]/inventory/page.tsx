import { InventoryRepository } from "@/modules/inventory/repository";
import { InventoryStats } from "@/modules/inventory/components/inventory-stats";
import * as R from "@/components/ui/MicrosoftRibbon";
import { File, Edit, Trash, ArrowUpFromDot, ArrowDownToDot, List, Package, BoxesIcon } from "lucide-react";
import { KpiCard } from "@/components/ui/KpiCard";
export default async function InventoryPage({
  params,
}: {
  params: Promise<{ companyId: string }>
}) {
  const { companyId } = await params;
  const stats = await InventoryRepository.getDashboardStats(companyId);

  return (
    <div className="space-y-0 mt-12">
      {/* Ribbon */}
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

      {/* Content */}
      <div className="py-3 space-y-3">

        {/* Stats */}
        <div className="flex justify-between">
          <KpiCard
            titulo="Total de Productos"
            contenido={"12"}
            descripcion="Items registrados en el sistema"
            color="#0078d4"
          />
          <KpiCard
            titulo="Valor Total de Inventario"
            contenido={"50.458$"}
            descripcion="Costo total del inventario actual"
            color="green"
          />
          <KpiCard
            titulo="Alerta de Stock"
            contenido={"3"}
            descripcion="Items por debajo del stock mínimo"
            color="red"
          />
          <KpiCard
            titulo="Items sin movimientos"
            contenido={"11"}
            descripcion="Items inactivos en los últimos 2 meses"
            color="orange"
          />
        </div>

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
