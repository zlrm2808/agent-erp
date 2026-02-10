
import { ProductForm } from "@/modules/inventory/components/product-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewProductPage({
    params,
}: {
    params: Promise<{ companyId: string }>
}) {
    const { companyId } = await params;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href={`/dashboard/${companyId}/inventory/products`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[#605e5c]">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#323130]">Nuevo Producto</h2>
                    <p className="text-sm text-[#605e5c]">
                        Ingresa los detalles del nuevo producto.
                    </p>
                </div>
            </div>

            <div className="rounded-md border border-[#e1dfdd] bg-white p-6 shadow-sm">
                <ProductForm companyId={companyId} />
            </div>
        </div>
    );
}
