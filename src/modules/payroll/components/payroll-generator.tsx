"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Plus,
    Calendar,
    Play,
    FileCheck,
    History,
    Loader2,
    ChevronRight,
    TrendingUp
} from "lucide-react";
import { generatePayrollAction } from "../actions";
import { toast } from "@/lib/toast";

export function PayrollGenerator({ companyId }: { companyId: string }) {
    const [isPending, startTransition] = useTransition();
    const [formData, setFormData] = useState({
        type: "QUINCENAL",
        startDate: "",
        endDate: ""
    });

    const handleGenerate = () => {
        if (!formData.startDate || !formData.endDate) {
            toast({ title: "Error", description: "Debe seleccionar el rango de fechas", variant: "destructive" });
            return;
        }

        startTransition(async () => {
            const res = await generatePayrollAction(companyId, formData);
            if (res.success) {
                toast({ title: "Nómina Generada", description: "Se han procesado los pagos para todos los empleados activos." });
            } else {
                toast({ title: "Error", description: res.error, variant: "destructive" });
            }
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-[#e1dfdd] p-8 rounded-sm shadow-sm">
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[#f3f2f1]">
                        <Play className="text-[#107c10] w-6 h-6" />
                        <h3 className="text-xl font-bold text-[#323130]">Procesar Nueva Nómina</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-[#605e5c] uppercase">Tipo de Nómina</Label>
                                <select
                                    className="w-full flex h-10 rounded-sm border border-[#d2d0ce] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0078d4]"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <optgroup label="Nóminas Periódicas">
                                        <option value="QUINCENAL">QUINCENAL (1ra - 15 / 16 - Fin)</option>
                                        <option value="MENSUAL">MENSUAL (Mes Completo)</option>
                                        <option value="SEMANAL">SEMANAL (7 Días Operativos)</option>
                                    </optgroup>
                                    <optgroup label="Pagos Especiales">
                                        <option value="CESTATICKET">CESTATICKET SOCIALISTA (Solo Bono)</option>
                                        <option value="HONORARIOS">HONORARIOS PROFESIONALES</option>
                                        <option value="VACACIONES">VACACIONES Y BONO VACACIONAL</option>
                                        <option value="AGUINALDOS">AGUINALDOS / UTILIDADES</option>
                                        <option value="ESPECIAL">BONIFICACIÓN ESPECIAL / OTROS</option>
                                    </optgroup>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-[#605e5c] uppercase">Desde</Label>
                                    <Input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-[#605e5c] uppercase">Hasta</Label>
                                    <Input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="h-10"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#f3f2f1] p-6 rounded-sm border border-[#e1dfdd] flex flex-col justify-center items-center text-center space-y-4">
                            <FileCheck className="text-[#107c10] w-12 h-12 opacity-40" />
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-[#323130]">Validación Automática</p>
                                <p className="text-[11px] text-[#605e5c]">Se calcularán retenciones IVSS, LPH y FAOV según la LOTTT.</p>
                            </div>
                            <Button
                                onClick={handleGenerate}
                                disabled={isPending}
                                className="w-full bg-[#107c10] hover:bg-[#0b5a0b] text-white font-bold h-12 uppercase tracking-widest text-xs shadow-lg"
                            >
                                {isPending ? <Loader2 className="animate-spin w-5 h-5" /> : "Ejecutar Cálculo"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-[#001d3d] text-white p-6 rounded-sm shadow-xl relative overflow-hidden">
                    <TrendingUp size={100} className="absolute -right-8 -bottom-8 opacity-10" />
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <h4 className="text-sky-200 text-[10px] font-black uppercase tracking-widest mb-2">Estado de Erogaciones</h4>
                            <p className="text-2xl font-black">Control de Costos</p>
                        </div>
                        <div className="mt-8 space-y-4">
                            <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                                <span className="text-white/60">Última Nómina</span>
                                <span className="font-mono">PAGADA</span>
                            </div>
                        </div>
                        <Button variant="ghost" className="mt-8 w-full border border-white/20 text-white hover:bg-white/10 text-xs h-9">
                            Ver Histórico <History className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="bg-white border border-[#e1dfdd] p-4 rounded-sm">
                    <h4 className="text-xs font-bold text-[#605e5c] mb-3 uppercase tracking-tighter">Próximos Vencimientos</h4>
                    <div className="space-y-2">
                        {[1, 2].map(i => (
                            <div key={i} className="flex items-center justify-between p-2 hover:bg-[#faf9f8] cursor-pointer group">
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-[#0078d4]" />
                                    <span className="text-xs text-[#323130]">Pago IVSS {i === 1 ? 'Enero' : 'Febrero'}</span>
                                </div>
                                <ChevronRight size={14} className="text-[#a19f9d] group-hover:text-[#0078d4]" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
