"use client";

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    PieChart,
    Users,
    TrendingUp,
    DollarSign,
    Building2,
    Info
} from "lucide-react";

export function DepartmentCostSummary({ companyId, payrollId }: { companyId: string, payrollId: string }) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mocking for UI demonstration, in real app this would call a server action
        const mockData = [
            { department: "VENTAS", employees: 12, netSalary: 12500, employerIvss: 1375, employerRpe: 250, employerFaov: 250, employerInces: 250, totalCost: 14625 },
            { department: "ADMINISTRACIÓN", employees: 5, netSalary: 8000, employerIvss: 880, employerRpe: 160, employerFaov: 160, employerInces: 160, totalCost: 9360 },
            { department: "OPERACIONES", employees: 25, netSalary: 18000, employerIvss: 1980, employerRpe: 360, employerFaov: 360, employerInces: 360, totalCost: 21060 },
        ];

        setData(mockData);
        setLoading(false);
    }, [companyId, payrollId]);

    const globalTotal = data.reduce((sum, d) => sum + d.totalCost, 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 border border-[#e1dfdd] rounded-sm shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Users size={60} />
                    </div>
                    <p className="text-[10px] font-black uppercase text-[#605e5c] tracking-widest mb-1">Fuerza Laboral</p>
                    <p className="text-2xl font-black text-[#323130]">{data.reduce((sum, d) => sum + d.employees, 0)} Empleados</p>
                    <p className="text-[10px] text-[#107c10] mt-2 font-bold italic">Distribución por centro de costos</p>
                </div>

                <div className="bg-[#001d3d] p-6 rounded-sm shadow-xl relative overflow-hidden text-white">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <TrendingUp size={60} />
                    </div>
                    <p className="text-[10px] font-black uppercase text-sky-300 tracking-widest mb-1">Carga Prestacional Total</p>
                    <p className="text-2xl font-black">Bs. {globalTotal.toLocaleString('es-VE')}</p>
                    <p className="text-[10px] text-white/60 mt-2">Incluye aportes patronales (IVSS, RPE, FAOV, INCES)</p>
                </div>

                <div className="bg-white p-6 border border-[#e1dfdd] rounded-sm shadow-sm flex items-center gap-4">
                    <div className="bg-emerald-100 p-3 rounded-full">
                        <DollarSign className="text-emerald-700" size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-[#605e5c] uppercase">Ratio de Costo Indirecto</p>
                        <p className="text-lg font-bold">~17% sobre Sueldos</p>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-[#e1dfdd] rounded-sm shadow-sm overflow-hidden">
                <div className="p-4 bg-[#f3f2f1] border-b border-[#e1dfdd] flex justify-between items-center">
                    <h3 className="font-bold text-xs text-[#323130] uppercase flex items-center gap-2">
                        <Building2 size={14} className="text-[#0078d4]" /> Desglose por Departamento
                    </h3>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-[10px] font-bold">DEPARTAMENTO</TableHead>
                            <TableHead className="text-[10px] font-bold text-center">EMPLEADOS</TableHead>
                            <TableHead className="text-[10px] font-bold text-right">SUELDO NETO</TableHead>
                            <TableHead className="text-[10px] font-bold text-right">IVSS/RPE (13%)</TableHead>
                            <TableHead className="text-[10px] font-bold text-right">FAOV/INC (4%)</TableHead>
                            <TableHead className="text-[10px] font-bold text-right">COSTO TOTAL</TableHead>
                            <TableHead className="text-[10px] font-bold text-right">% PESO</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map(dept => (
                            <TableRow key={dept.department} className="hover:bg-[#faf9f8] transition-colors">
                                <TableCell className="text-xs font-black text-[#323130]">{dept.department}</TableCell>
                                <TableCell className="text-center text-xs">{dept.employees}</TableCell>
                                <TableCell className="text-right text-xs font-mono">Bs. {dept.netSalary.toLocaleString()}</TableCell>
                                <TableCell className="text-right text-xs text-rose-600">Bs. {(dept.employerIvss + dept.employerRpe).toLocaleString()}</TableCell>
                                <TableCell className="text-right text-xs text-rose-600">Bs. {(dept.employerFaov + dept.employerInces).toLocaleString()}</TableCell>
                                <TableCell className="text-right text-xs font-black text-[#001d3d]">Bs. {dept.totalCost.toLocaleString()}</TableCell>
                                <TableCell className="text-right">
                                    <span className="text-[10px] font-bold bg-[#f3f2f1] px-2 py-0.5 rounded-full">
                                        {((dept.totalCost / globalTotal) * 100).toFixed(1)}%
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-sm flex gap-3 items-start">
                <Info size={16} className="text-amber-700 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-800 leading-relaxed">
                    <strong>Importante:</strong> Los costos mostrados son proyecciones mensuales basadas en la última nómina cerrada. Los porcentajes de IVSS pueden variar según el grado de riesgo de la empresa declarado ante la tesorería de seguridad social.
                </p>
            </div>
        </div>
    );
}
