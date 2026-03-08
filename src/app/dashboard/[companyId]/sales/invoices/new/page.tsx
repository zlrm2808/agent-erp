
import { BillingForm } from "@/modules/sales/components/billing-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { InventoryRepository } from "@/modules/inventory/repository";

export default async function NewInvoicePage({
    params,
}: {
    params: Promise<{ companyId: string }>
}) {
    const { companyId } = await params;
    const products = await InventoryRepository.getProducts(companyId);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={`/dashboard/${companyId}/sales/invoices`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[#605e5c]">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-[#323130]">Emisión de Factura Digital</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <p className="text-xs font-bold text-emerald-700 uppercase tracking-tighter">
                                Entorno Fiscal Garantizado por Imprenta Digital Autorizada
                            </p>
                        </div>
                    </div>
                </div>

                <div className="hidden md:flex flex-col items-end">
                    <span className="text-[10px] text-[#605e5c] font-bold uppercase">Providencia Administrativa</span>
                    <span className="text-[10px] font-mono text-[#0078d4] font-black">SNAT/2024/000102</span>
                </div>
            </div>

            <BillingForm companyId={companyId} initialProducts={products} />
        </div>
    );
}
