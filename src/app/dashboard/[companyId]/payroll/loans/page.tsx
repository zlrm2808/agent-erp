import { PayrollRepository } from "@/modules/payroll/repository";
import { LoanManager } from "@/modules/payroll/components/loan-manager";
import * as R from "@/components/ui/MicrosoftRibbon";
import { Landmark, ArrowLeft } from "lucide-react";

export default async function LoansPage({
    params
}: {
    params: Promise<{ companyId: string }>;
}) {
    const { companyId } = await params;

    const [employees, loans] = await Promise.all([
        PayrollRepository.getEmployees(companyId),
        PayrollRepository.getLoans(companyId)
    ]);

    return (
        <div className="space-y-0">
            <R.RibbonContainer>
                <div className="flex h-28 overflow-x-auto no-scrollbar items-stretch bg-white">
                    <R.RibbonGroup label="Préstamos">
                        <R.RibbonBtnLarge icon="PlusCircle" label="Nuevo Préstamo" color="text-[#8764b8]" />
                        <R.RibbonBtnLarge icon="FileText" label="Estado de Cuenta" color="text-[#605e5c]" />
                    </R.RibbonGroup>
                    <R.RibbonGroup label="Módulo">
                        <R.RibbonBtnLarge icon="ArrowLeft" label="Volver" href={`/dashboard/${companyId}/payroll`} />
                    </R.RibbonGroup>
                </div>
            </R.RibbonContainer>

            <div className="p-6">

                <LoanManager
                    companyId={companyId}
                    employees={employees}
                    loans={loans}
                />
            </div>
        </div>
    );
}
