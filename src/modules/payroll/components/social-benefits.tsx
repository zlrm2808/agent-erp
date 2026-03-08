"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    ShieldCheck,
    Search,
    TrendingUp,
    Info,
    Calendar,
    ArrowUpRight,
    Loader2
} from "lucide-react";

export function SocialBenefitsManager({ companyId, employees }: { companyId: string, employees: any[] }) {
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

    // Mock calculation for UI demonstration (Real calculation happens in repo)
    const calculateBenefits = (emp: any) => {
        const hireDate = new Date(emp.hireDate);
        const now = new Date();
        const months = (now.getFullYear() - hireDate.getFullYear()) * 12 + (now.getMonth() - hireDate.getMonth());
        const daily = emp.baseSalary / 30;
        const guarantee = months * 5 * daily;
        const addDays = Math.min(Math.floor(months / 12) * 2, 30);
        const additional = addDays * daily;

        return {
            months,
            guaranteeDays: months * 5,
            guaranteeAmount: guarantee,
            additionalDays: addDays,
            additionalAmount: additional,
            total: guarantee + additional
        };
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-6">
                <div className="bg-white border border-[#e1dfdd] rounded-sm shadow-sm overflow-hidden">
                    <div className="p-4 bg-[#f3f2f1] border-b border-[#e1dfdd] flex justify-between items-center">
                        <h3 className="font-bold text-xs text-[#323130] uppercase flex items-center gap-2">
                            <ShieldCheck size={14} className="text-[#107c10]" /> Accumulado de Prestaciones (Art. 142)
                        </h3>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-[10px] font-bold">EMPLEADO</TableHead>
                                <TableHead className="text-[10px] font-bold">ANTIGÜEDAD</TableHead>
                                <TableHead className="text-[10px] font-bold text-right">GARANTÍA (Bs.)</TableHead>
                                <TableHead className="text-[10px] font-bold text-right">DÍAS ADIC.</TableHead>
                                <TableHead className="text-[10px] font-bold text-right">TOTAL ESTIMADO</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employees.map(emp => {
                                const calc = calculateBenefits(emp);
                                return (
                                    <TableRow key={emp.id} className="cursor-pointer hover:bg-[#faf9f8]" onClick={() => setSelectedEmployee({ ...emp, calc })}>
                                        <TableCell className="text-xs font-bold uppercase">{emp.lastName}, {emp.firstName}</TableCell>
                                        <TableCell className="text-xs text-[#605e5c]">{calc.months} Meses</TableCell>
                                        <TableCell className="text-right font-mono text-xs">Bs. {calc.guaranteeAmount.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</TableCell>
                                        <TableCell className="text-right text-xs">{calc.additionalDays} días</TableCell>
                                        <TableCell className="text-right font-black text-[#107c10] text-xs">
                                            Bs. {calc.total.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell>
                                            <ArrowUpRight size={14} className="text-[#0078d4]" />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="space-y-6">
                {selectedEmployee ? (
                    <div className="bg-white border-2 border-[#0078d4] p-6 rounded-sm shadow-xl animate-in fade-in zoom-in-95 duration-200">
                        <h4 className="font-black text-sm text-[#323130] mb-1 uppercase tracking-tight">Detalle de Progresión</h4>
                        <p className="text-[10px] text-[#605e5c] border-b border-[#f3f2f1] pb-3 mb-4">{selectedEmployee.lastName}, {selectedEmployee.firstName}</p>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-[#605e5c]">Garantía Trimestral ({selectedEmployee.calc.guaranteeDays} d)</span>
                                <span className="font-bold">Bs. {selectedEmployee.calc.guaranteeAmount.toLocaleString('es-VE')}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-[#605e5c]">Días Adicionales ({selectedEmployee.calc.additionalDays} d)</span>
                                <span className="font-bold">Bs. {selectedEmployee.calc.additionalAmount.toLocaleString('es-VE')}</span>
                            </div>
                            <div className="pt-3 border-t border-[#f3f2f1] flex justify-between items-center">
                                <span className="text-xs font-black uppercase">Total Pasivo</span>
                                <span className="text-lg font-black text-[#107c10]">Bs. {selectedEmployee.calc.total.toLocaleString('es-VE')}</span>
                            </div>
                        </div>

                        <Button className="w-full mt-6 bg-[#0078d4] h-9 text-xs uppercase font-bold tracking-widest">
                            Generar Constancia
                        </Button>
                    </div>
                ) : (
                    <div className="bg-[#f3f2f1] p-6 rounded-sm border border-[#e1dfdd] text-center space-y-3">
                        <Info size={40} className="mx-auto text-[#0078d4] opacity-20" />
                        <p className="text-xs text-[#605e5c]">Seleccione un trabajador para ver el desglose detallado de sus prestaciones sociales acumuladas hasta la fecha.</p>
                    </div>
                )}

                <div className="bg-emerald-900 text-white p-5 rounded-sm shadow-lg relative overflow-hidden">
                    <TrendingUp size={80} className="absolute -right-4 -bottom-4 opacity-10" />
                    <h5 className="text-[10px] font-black uppercase text-emerald-300 mb-1">Impacto Financiero</h5>
                    <p className="text-xl font-bold">Reserva de Pasivos</p>
                    <p className="text-[11px] mt-4 text-emerald-100/70 leading-relaxed">
                        Recuerde que según el Art. 142 literal (c), al finalizar la relación laboral se pagará lo que sea más favorable entre el acumulado y el cálculo sobre el último salario integral.
                    </p>
                </div>
            </div>
        </div>
    );
}
