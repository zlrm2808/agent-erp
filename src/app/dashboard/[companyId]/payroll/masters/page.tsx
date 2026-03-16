import { PayrollRepository } from "@/modules/payroll/repository";
import { PayrollMastersClient } from "@/modules/payroll/components/payroll-masters-client";
import * as R from "@/components/ui/MicrosoftRibbon";
import { Building2, Briefcase } from "lucide-react";
import Link from "next/link";

export default async function PayrollMastersPage({
    params
}: {
    params: Promise<{ companyId: string }>;
}) {
    const { companyId } = await params;
    const [departments, positions, concepts, constants] = await Promise.all([
        PayrollRepository.getDepartments(companyId),
        PayrollRepository.getPositions(companyId),
        PayrollRepository.getConcepts(companyId),
        PayrollRepository.getConstants(companyId)
    ]);

    return (
        <div className="space-y-0">
            <R.RibbonContainer>
                <div className="flex h-28 overflow-x-auto no-scrollbar items-stretch bg-white">
                    <R.RibbonGroup label="Estructura">
                        <R.RibbonBtnLarge icon="Building2" label="Departamentos" color="text-[#0078d4]" />
                        <R.RibbonBtnLarge icon="Briefcase" label="Cargos" color="text-[#8764b8]" />
                    </R.RibbonGroup>
                    <R.RibbonGroup label="Configuración">
                        <R.RibbonBtnLarge icon="BadgeCent" label="Conceptos" color="text-[#107c10]" />
                        <R.RibbonBtnLarge icon="Settings" label="Constantes" color="text-[#605e5c]" />
                    </R.RibbonGroup>
                    <R.RibbonGroup label="Módulo">
                        <R.RibbonBtnLarge icon="ArrowLeft" label="Volver" href={`/dashboard/${companyId}/payroll`} />
                    </R.RibbonGroup>
                </div>
            </R.RibbonContainer>

            <div className="p-6">

                <PayrollMastersClient
                    companyId={companyId}
                    initialDepartments={departments}
                    initialPositions={positions}
                    initialConcepts={concepts}
                    initialConstants={constants}
                />
            </div>
        </div>
    );
}
