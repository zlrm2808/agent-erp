"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, ShieldCheck, Info, Save, Loader2 } from "lucide-react";
import { updatePayrollParamsAction } from "../actions";
import { toast } from "@/lib/toast";

export function PayrollSettingsForm({ companyId, params }: { companyId: string, params: any }) {
    const [isPending, startTransition] = useTransition();

    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        startTransition(async () => {
            const res = await updatePayrollParamsAction(companyId, data);
            if (res.success) {
                toast({ title: "Parámetros Actualizados", description: "Las fórmulas de nómina usarán los nuevos valores." });
            } else {
                toast({ title: "Error", description: res.error, variant: "destructive" });
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white border border-[#e1dfdd] p-8 rounded-sm shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Settings size={120} />
                </div>

                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[#f3f2f1]">
                    <Settings className="text-[#0078d4] w-6 h-6" />
                    <h3 className="text-xl font-bold text-[#323130]">Configuración de Nómina (Venezuela)</h3>
                </div>

                <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 relative z-10">
                    <div className="space-y-6">
                        <h4 className="text-xs font-black uppercase text-[#0078d4] tracking-widest flex items-center gap-2">
                            <ShieldCheck size={14} /> Constantes Legales
                        </h4>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-[#605e5c]">Sueldo Mínimo Nacional (Bs.)</Label>
                                <Input name="minWage" type="number" step="0.01" defaultValue={params.minWage} className="font-mono" />
                                <p className="text-[10px] text-[#a19f9d]">Base para el tope de cotización IVSS (5 salarios).</p>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-[#605e5c]">Cestaticket Socialista (Bs.)</Label>
                                <Input name="mealTicket" type="number" step="0.01" defaultValue={params.mealTicket} className="font-mono" />
                                <p className="text-[10px] text-[#a19f9d]">Monto fijo mensual (Art. 7 Providencia).</p>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-[#605e5c]">Unidad Tributaria (U.T.)</Label>
                                <Input name="taxUnit" type="number" step="0.01" defaultValue={params.taxUnit} className="font-mono text-amber-700" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-[#605e5c]">Tope ISLR (U.T. Anual)</Label>
                                <Input name="islrThreshold" type="number" defaultValue={params.islrThreshold || 1000} className="font-mono text-blue-700" />
                                <p className="text-[10px] text-[#a19f9d]">Mínimo de UT anuales para ser sujeto de retención (Normalmente 1000 UT).</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-xs font-black uppercase text-[#107c10] tracking-widest flex items-center gap-2">
                            <Info size={14} /> Tasas de Retención (Trabajador)
                        </h4>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-[#605e5c]">I.V.S.S. (%)</Label>
                                <Input name="ivssRate" type="number" step="0.001" defaultValue={params.ivssRate} className="font-mono" />
                                <p className="text-[10px] text-[#a19f9d]">Porcentaje de Seguro Social (Normalmente 0.04).</p>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-[#605e5c]">F.A.O.V. / L.P.H. (%)</Label>
                                <Input name="faovRate" type="number" step="0.001" defaultValue={params.faovRate} className="font-mono" />
                                <p className="text-[10px] text-[#a19f9d]">Ley de Régimen Prestacional de Vivienda (Normalmente 0.01).</p>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-[#605e5c]">R.P.E. / Paro Forzoso (%)</Label>
                                <Input name="lpeRate" type="number" step="0.001" defaultValue={params.lpeRate} className="font-mono" />
                                <p className="text-[10px] text-[#a19f9d]">Seguro de Paro Forzoso (Normalmente 0.005).</p>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 pt-6 border-t border-[#f3f2f1] flex justify-between items-center">
                        <div className="flex items-center gap-2 text-[#605e5c] text-xs max-w-md">
                            <Info size={16} className="shrink-0 text-[#0078d4]" />
                            <p>Las tasas patronales se calculan automáticamente en el reporte de costos, no afectan el neto del trabajador.</p>
                        </div>
                        <Button type="submit" disabled={isPending} className="bg-[#0078d4] hover:bg-[#005a9e] min-w-[200px] h-11 uppercase font-black text-xs tracking-tighter shadow-lg">
                            {isPending ? <Loader2 className="animate-spin w-5 h-5" /> : <><Save className="mr-2 h-4 w-4" /> Guardar Parametrización</>}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
