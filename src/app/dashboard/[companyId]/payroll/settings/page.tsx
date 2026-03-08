import { PayrollRepository } from "@/modules/payroll/repository";
import { PayrollSettingsForm } from "@/modules/payroll/components/payroll-settings";
import { Settings, Info } from "lucide-react";

export default async function PayrollSettingsPage({
    params
}: {
    params: Promise<{ companyId: string }>;
}) {
    const { companyId } = await params;
    const payrollParams = await PayrollRepository.getParameters(companyId);

    return (
        <div className="space-y-8 mt-12">
            <div className="flex flex-col gap-1 pb-6 border-b border-[#e1dfdd]">
                <h1 className="text-3xl font-black text-[#323130] tracking-tighter flex items-center gap-3">
                    <Settings className="w-8 h-8 text-[#605e5c]" /> Parametrización de Nómina
                </h1>
                <p className="text-sm text-[#605e5c]">
                    Ajuste los valores legales base para garantizar cálculos correctos bajo la normativa venezolana.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                <div className="xl:col-span-3">
                    <PayrollSettingsForm companyId={companyId} params={payrollParams} />
                </div>

                <div className="space-y-4">
                    <div className="bg-[#fff9e6] border border-[#ffeb9c] p-4 rounded-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <Info className="text-[#9a6b00] w-4 h-4" />
                            <h5 className="text-xs font-bold text-[#9a6b00] uppercase">Nota Legal</h5>
                        </div>
                        <p className="text-[11px] text-[#805e00] leading-relaxed">
                            Los aportes patronales (IVSS 9-11%, Vivienda 2%, Inces 2%) se configuran por defecto según las leyes venezolanas vigentes. Si su empresa goza de alguna exoneración, contáctenos.
                        </p>
                    </div>

                    <div className="bg-[#f3f2f1] border border-[#e1dfdd] p-4 rounded-sm">
                        <h5 className="text-xs font-bold text-[#323130] uppercase mb-4 tracking-tighter">Ayuda Rápida</h5>
                        <ul className="space-y-3">
                            <li className="text-[11px] text-[#605e5c] flex gap-2">
                                <span className="bg-[#0078d4] w-1 h-1 rounded-full mt-1.5 shrink-0" />
                                <span>El tope de IVSS se calcula multiplicando el Salario Mínimo por 5.</span>
                            </li>
                            <li className="text-[11px] text-[#605e5c] flex gap-2">
                                <span className="bg-[#0078d4] w-1 h-1 rounded-full mt-1.5 shrink-0" />
                                <span>El LPE (R.P.E.) aplica para empresas con más de 10 trabajadores.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
