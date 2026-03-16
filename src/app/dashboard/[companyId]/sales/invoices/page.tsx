import { SalesRepository } from "@/modules/sales/repository";
import { InvoiceList } from "@/modules/sales/components/invoice-list";
import * as R from "@/components/ui/MicrosoftRibbon";
import {
    Plus,
    ReceiptText,
    FileText,
    FileCheck,
    Users,
    Settings
} from "lucide-react";
import Link from "next/link";

export default async function InvoicesPage({
    params,
}: {
    params: Promise<{ companyId: string }>;
}) {
    const { companyId } = await params;
    const invoices = await SalesRepository.getInvoices(companyId);

    return (
        <div className="space-y-0 animate-in fade-in duration-500">
            <R.RibbonContainer>
                <div className="flex h-28 overflow-x-auto no-scrollbar items-stretch bg-white">
                    <R.RibbonGroup label="Documentos">
                        <R.RibbonBtnLarge
                            icon="Plus"
                            label="Nueva Factura"
                            href={`/dashboard/${companyId}/sales/invoices/new`}
                            color="text-[#0078d4]"
                        />
                        <div className="flex-col">
                            <R.RibbonBtnSmall icon="FileText" label="Presupuesto" />
                            <R.RibbonBtnSmall icon="FileCheck" label="Nota Entrega" />
                        </div>
                    </R.RibbonGroup>

                    <R.RibbonGroup label="Gestión">
                        <R.RibbonBtnLarge icon="Users" label="Clientes" href={`/dashboard/${companyId}/customers`} />
                        <R.RibbonBtnLarge icon="ReceiptText" label="Fiscal" href={`/dashboard/${companyId}/reports/sales`} />
                    </R.RibbonGroup>

                    <R.RibbonGroup label="Configuración">
                        <R.RibbonBtnSmall icon="Settings" label="Parámetros" />
                    </R.RibbonGroup>
                </div>
            </R.RibbonContainer>

            <div className="px-6 py-6 pb-12">
                <InvoiceList invoices={invoices} companyId={companyId} />
            </div>
        </div>
    );
}
