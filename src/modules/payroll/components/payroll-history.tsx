"use client";

import { useState, useTransition } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Download,
    FileText,
    ChevronRight,
    Building2,
    Calendar,
    Loader2,
    Database
} from "lucide-react";
import { getBankFileAction, getEmployerReportAction } from "../actions";
import { toast } from "@/lib/toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";

export function PayrollHistory({ companyId, initialHistory = [] }: { companyId: string, initialHistory: any[] }) {
    const [history] = useState(initialHistory);
    const [isPending, startTransition] = useTransition();
    const [selectedPayroll, setSelectedPayroll] = useState<any>(null);
    const [reportData, setReportData] = useState<any>(null);

    const handleExportBank = (payrollId: string, bank: "BANESCO" | "BBVA") => {
        startTransition(async () => {
            const res = await getBankFileAction(companyId, payrollId, bank);
            if (res.success && res.content) {
                const blob = new Blob([res.content], { type: "text/plain" });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `NOMINA_${bank}_${payrollId.slice(0, 6)}.txt`;
                a.click();
                toast({ title: "Archivo Generado", description: `Se ha descargado el archivo para ${bank}.` });
            } else {
                toast({ title: "Error", description: res.error, variant: "destructive" });
            }
        });
    };

    const handleViewReport = (payrollId: string) => {
        startTransition(async () => {
            const res = await getEmployerReportAction(companyId, payrollId);
            if (res.success) {
                setReportData(res.report);
                setSelectedPayroll(history.find((h: any) => h.id === payrollId));
            } else {
                toast({ title: "Error", description: res.error, variant: "destructive" });
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="bg-white border border-[#e1dfdd] rounded-sm shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#f3f2f1]">
                        <TableRow>
                            <TableHead className="text-xs font-bold text-[#605e5c]">PERÍODO</TableHead>
                            <TableHead className="text-xs font-bold text-[#605e5c]">TIPO</TableHead>
                            <TableHead className="text-xs font-bold text-[#605e5c]">EMPLEADOS</TableHead>
                            <TableHead className="text-right text-xs font-bold text-[#605e5c]">TOTAL NETO</TableHead>
                            <TableHead className="text-right text-xs font-bold text-[#605e5c]">ACCIONES</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {history.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-[#a19f9d] italic">
                                    No hay nóminas procesadas.
                                </TableCell>
                            </TableRow>
                        ) : (
                            history.map((p: any) => (
                                <TableRow key={p.id} className="hover:bg-[#faf9f8]">
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-[#0078d4]" />
                                            <span className="font-bold text-sm text-[#323130]">{p.period}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                                            {p.type}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-xs text-[#605e5c]">
                                        {p._count?.details || 0} trabajadores
                                    </TableCell>
                                    <TableCell className="text-right font-mono font-bold text-[#323130]">
                                        Bs. {p.totalNet.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 text-[10px] font-bold border-[#d2d0ce]"
                                                onClick={() => handleViewReport(p.id)}
                                            >
                                                <FileText className="w-3.5 h-3.5 mr-1 text-[#0078d4]" /> APORTES
                                            </Button>
                                            <div className="flex border border-[#d2d0ce] rounded-md overflow-hidden">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 px-2 text-[10px] font-black bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-none border-r border-[#d2d0ce]"
                                                    onClick={() => handleExportBank(p.id, "BANESCO")}
                                                >
                                                    BANESCO
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 px-2 text-[10px] font-black bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-none"
                                                    onClick={() => handleExportBank(p.id, "BBVA")}
                                                >
                                                    BBVA
                                                </Button>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Modal de Aportes Patronales */}
            <Dialog open={!!reportData} onOpenChange={() => setReportData(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Database className="text-[#0078d4]" /> Reporte de Pasivos Patronales
                        </DialogTitle>
                        <DialogDescription>
                            Resumen de obligaciones legales para el período {selectedPayroll?.period}
                        </DialogDescription>
                    </DialogHeader>

                    {reportData && (
                        <div className="space-y-6 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-[#f3f2f1] rounded-sm border border-[#e1dfdd]">
                                    <p className="text-[10px] uppercase font-bold text-[#605e5c]">Carga Neta (Pagado)</p>
                                    <p className="text-2xl font-black text-[#323130]">Bs. {reportData.totalNet.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</p>
                                </div>
                                <div className="p-4 bg-[#eff6fc] rounded-sm border border-[#0078d4]/20">
                                    <p className="text-[10px] uppercase font-bold text-[#0078d4]">Total Aportes Empresa</p>
                                    <p className="text-2xl font-black text-[#0078d4]">Bs. {reportData.employerCosts.total.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</p>
                                </div>
                            </div>

                            <div className="border border-[#e1dfdd] rounded-sm overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-[#faf9f8]">
                                        <TableRow>
                                            <TableHead className="text-xs font-bold">Concepto Patronal</TableHead>
                                            <TableHead className="text-xs font-bold text-right">Monto (Bs.)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="text-sm">IVSS Patronal (9-11%)</TableCell>
                                            <TableCell className="text-right font-mono font-bold">Bs. {reportData.employerCosts.ivss.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="text-sm">RPE (Paro Forzoso) Patronal (2%)</TableCell>
                                            <TableCell className="text-right font-mono font-bold">Bs. {reportData.employerCosts.rpe.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="text-sm">FAOV (Vivienda) Patronal (2%)</TableCell>
                                            <TableCell className="text-right font-mono font-bold">Bs. {reportData.employerCosts.faov.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="text-sm">INCES Patronal (2%)</TableCell>
                                            <TableCell className="text-right font-mono font-bold">Bs. {reportData.employerCosts.inces.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</TableCell>
                                        </TableRow>
                                        <TableRow className="bg-[#f3f2f1] font-black">
                                            <TableCell className="text-sm uppercase">Total Pasivos Laborales</TableCell>
                                            <TableCell className="text-right font-mono">Bs. {reportData.employerCosts.total.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setReportData(null)}>Cerrar</Button>
                                <Button className="bg-[#0078d4] hover:bg-[#005a9e]">
                                    <Download className="w-4 h-4 mr-2" /> Descargar PDF (Simulado)
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
