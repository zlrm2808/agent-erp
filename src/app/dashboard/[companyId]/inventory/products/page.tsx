
import { InventoryRepository } from "@/modules/inventory/repository";
import { ProductList } from "@/modules/inventory/components/product-list";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ProductsPage({
    params,
}: {
    params: Promise<{ companyId: string }>
}) {
    const { companyId } = await params;
    const products = await InventoryRepository.getProducts(companyId);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Link href={`/dashboard/${companyId}/inventory`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[#605e5c]">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-[#323130]">Productos</h2>
                        <p className="text-sm text-[#605e5c]">
                            Catálogo general de inventario.
                        </p>
                    </div>
                </div>
                <Link href={`/dashboard/${companyId}/inventory/products/new`}>
                    <Button className="bg-primary hover:bg-primary/90">
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Producto
                    </Button>
                </Link>
            </div>

            <ProductList products={products} companyId={companyId} />
        </div>
    );
}
