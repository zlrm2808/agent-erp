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
    const [departments, positions] = await Promise.all([
        PayrollRepository.getDepartments(companyId),
        PayrollRepository.getPositions(companyId)
    ]);

    return (
        <div className="space-y-0">
            <R.RibbonContainer>
                <div className="flex h-28 overflow-x-auto no-scrollbar items-stretch bg-white">
                    <R.RibbonGroup label="Datos Maestros">
                        <R.RibbonBtnLarge icon="Building2" label="Departamentos" color="text-[#0078d4]" />
                        <R.RibbonBtnLarge icon="Briefcase" label="Cargos" color="text-[#8764b8]" />
                    </R.RibbonGroup>
                    <R.RibbonGroup label="Módulo">
                        <R.RibbonBtnLarge icon="ArrowLeft" label="Volver" href={`/dashboard/${companyId}/payroll`} />
                    </R.RibbonGroup>
                </div>
            </R.RibbonContainer>

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-black text-[#323130] tracking-tight uppercase flex items-center gap-2">
                        <Building2 className="w-6 h-6 text-[#0078d4]" />
                        Datos Maestros de Nómina
                    </h1>
                    <p className="text-xs text-[#605e5c] mt-1">
                        Configure los departamentos y cargos que estarán disponibles al registrar nuevos empleados.
                    </p>
                </div>

                <PayrollMastersClient
                    companyId={companyId}
                    initialDepartments={departments}
                    initialPositions={positions}
                />
            </div>
        </div>
    );
}
