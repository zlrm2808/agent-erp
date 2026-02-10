
import { InventoryRepository } from "@/modules/inventory/repository";
import { MovementForm } from "@/modules/inventory/components/movement-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewMovementPage({
    params,
    searchParams,
}: {
    params: Promise<{ companyId: string }>;
    searchParams: Promise<{ type?: string }>;
}) {
    const { companyId } = await params;
    const { type } = await searchParams;
    const products = await InventoryRepository.getProducts(companyId);

    const initialType = type === "IN" || type === "OUT" || type === "ADJUSTMENT" ? type : undefined;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href={`/dashboard/${companyId}/inventory`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[#605e5c]">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#323130]">Registrar Movimiento</h2>
                    <p className="text-sm text-[#605e5c]">
                        Registra entradas, salidas o ajustes de inventario.
                    </p>
                </div>
            </div>

            <div className="rounded-md border border-[#e1dfdd] bg-white p-6 shadow-sm">
                <MovementForm companyId={companyId} products={products} initialType={initialType} />
            </div>
        </div>
    );
}
