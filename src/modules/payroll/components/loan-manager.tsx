"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Landmark, Plus, Loader2, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { createLoanAction } from "../actions";
import { toast } from "@/lib/toast";

interface LoanManagerProps {
    companyId: string;
    employees: any[];
    loans: any[];
}

export function LoanManager({ companyId, employees, loans }: LoanManagerProps) {
    const [employeeId, setEmployeeId] = useState("");
    const [amount, setAmount] = useState("");
    const [installments, setInstallments] = useState("10");
    const [description, setDescription] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!employeeId || !amount || !installments) return;

        startTransition(async () => {
            const res = await createLoanAction(companyId, {
                employeeId,
                amount: parseFloat(amount),
                totalInstallments: installments,
                description,
                startDate: new Date().toISOString()
            });

            if (res.success) {
                toast({ title: "Préstamo registrado", description: "El préstamo se ha creado y se descontará en la próxima nómina." });
                setEmployeeId("");
                setAmount("");
                setDescription("");
            } else {
                toast({ title: "Error", description: res.error, variant: "destructive" });
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="bg-white border border-[#e1dfdd] rounded-sm shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-[#e1dfdd] bg-[#faf9f8] relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8764b8]" />
                    <div className="p-2 rounded-full bg-[#8764b818]">
                        <Landmark className="w-4 h-4 text-[#8764b8]" />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#323130]">Registro de Préstamo</h3>
                        <p className="text-[10px] text-[#605e5c]">Emisión de préstamos personales con descuento por nómina</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-5 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-1 md:col-span-1">
                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Empleado</Label>
                        <Select value={employeeId} onValueChange={setEmployeeId}>
                            <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                            <SelectContent>
                                {employees.map(emp => (
                                    <SelectItem key={emp.id} value={emp.id}>{emp.lastName}, {emp.firstName}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Monto (Bs.)</Label>
                        <Input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="h-8 text-xs" required />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Cuotas</Label>
                        <Input type="number" value={installments} onChange={e => setInstallments(e.target.value)} placeholder="10" className="h-8 text-xs" required />
                    </div>
                    <Button type="submit" disabled={isPending} className="h-8 gap-1 text-xs bg-[#8764b8] hover:bg-[#6c4d97]">
                        {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                        Registrar Préstamo
                    </Button>
                    <div className="md:col-span-4 space-y-1">
                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Motivo / Descripción</Label>
                        <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Ej. Adelanto por gastos médicos" className="h-8 text-xs" />
                    </div>
                </form>
            </div>

            <div className="bg-white border border-[#e1dfdd] rounded-sm shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-[#f3f2f1] bg-[#faf9f8]">
                    <h3 className="text-xs font-bold uppercase text-[#323130]">Préstamos Activos y Recientes</h3>
                </div>
                <Table>
                    <TableHeader className="bg-[#f3f2f1]">
                        <TableRow>
                            <TableHead className="text-[10px] font-bold text-[#605e5c] uppercase">Empleado</TableHead>
                            <TableHead className="text-[10px] font-bold text-[#605e5c] uppercase text-right">Monto Total</TableHead>
                            <TableHead className="text-[10px] font-bold text-[#605e5c] uppercase text-center">Cuotas</TableHead>
                            <TableHead className="text-[10px] font-bold text-[#605e5c] uppercase text-right">Monto Cuota</TableHead>
                            <TableHead className="text-[10px] font-bold text-[#605e5c] uppercase text-center">Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loans.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-xs text-[#a19f9d] italic">
                                    No hay préstamos registrados.
                                </TableCell>
                            </TableRow>
                        ) : (
                            loans.map((loan) => (
                                <TableRow key={loan.id} className="hover:bg-[#faf9f8]">
                                    <TableCell>
                                        <div className="text-sm font-medium text-[#323130]">{loan.employee.lastName}, {loan.employee.firstName}</div>
                                        <div className="text-[10px] text-[#605e5c]">{loan.description || "Sin descripción"}</div>
                                    </TableCell>
                                    <TableCell className="text-sm font-bold text-right">{loan.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                                    <TableCell className="text-center">
                                        <span className="text-xs font-medium">
                                            {loan.totalInstallments - loan.remainingInstallments} / {loan.totalInstallments}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-sm text-right text-[#a4262c] font-bold">
                                        {loan.installmentAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            {loan.status === "ACTIVE" ? (
                                                <span className="flex items-center gap-1 text-[10px] font-bold text-[#0078d4] bg-[#eff6fc] px-2 py-0.5 rounded-full">
                                                    <Clock className="w-3 h-3" />
                                                    COBRANDO
                                                </span>
                                            ) : loan.status === "PAID" ? (
                                                <span className="flex items-center gap-1 text-[10px] font-bold text-[#107c10] bg-[#dff6dd] px-2 py-0.5 rounded-full">
                                                    <CheckCircle className="w-3 h-3" />
                                                    PAGADO
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-[10px] font-bold text-[#605e5c] bg-[#f3f2f1] px-2 py-0.5 rounded-full">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {loan.status}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
