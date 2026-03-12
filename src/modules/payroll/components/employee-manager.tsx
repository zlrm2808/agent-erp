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
    Users,
    UserPlus,
    Search,
    Building,
    CreditCard,
    Briefcase,
    Loader2,
    BadgeCent
} from "lucide-react";
import { createEmployeeAction } from "../actions";
import { toast } from "@/lib/toast";

export function EmployeeManager({
    companyId,
    initialEmployees = [],
    departments = [],
    positions = [],
    forceShowForm = false,
    onFormClose
}: {
    companyId: string,
    initialEmployees: any[],
    departments?: any[],
    positions?: any[],
    forceShowForm?: boolean,
    onFormClose?: () => void
}) {
    const [isPending, startTransition] = useTransition();

    const showForm = forceShowForm;

    const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        startTransition(async () => {
            const res = await createEmployeeAction(companyId, data);
            if (res.success) {
                toast({ title: "Empleado Registrado", description: "El trabajador ha sido añadido a la nómina." });
                form.reset();
                if (onFormClose) onFormClose();
            } else {
                toast({ title: "Error", description: res.error, variant: "destructive" });
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 border border-[#e1dfdd] rounded-sm shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0078d4]" />
                <div className="flex items-center gap-3">
                    <div className="bg-[#0078d4]/10 p-2 rounded-full">
                        <Users className="text-[#0078d4] w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#323130] uppercase text-xs tracking-wider">Maestro de Personal</h3>
                        <p className="text-[10px] text-[#605e5c]">Listado oficial de trabajadores activos y sus condiciones salariales.</p>
                    </div>
                </div>
                {showForm && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-rose-600 font-bold text-[10px]"
                        onClick={onFormClose}
                    >
                        CANCELAR REGISTRO
                    </Button>
                )}
            </div>

            {showForm && (
                <div className="bg-white border border-[#e1dfdd] p-6 rounded-sm shadow-md animate-in slide-in-from-top-4 duration-300">
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Nombres</Label>
                            <Input name="firstName" placeholder="Ej. Juan" required className="h-9" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Apellidos</Label>
                            <Input name="lastName" placeholder="Ej. Pérez" required className="h-9" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Cédula (RIF)</Label>
                            <Input name="idNumber" placeholder="V-12345678" required className="h-9 font-mono" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Cargo</Label>
                            <select name="position" className="w-full flex h-9 rounded-sm border border-[#d2d0ce] bg-white px-3 py-2 text-xs">
                                <option value="">-- Seleccionar Cargo --</option>
                                {positions.map((p: any) => (
                                    <option key={p.id} value={p.name}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Departamento</Label>
                            <select name="department" className="w-full flex h-9 rounded-sm border border-[#d2d0ce] bg-white px-3 py-2 text-xs">
                                <option value="">-- Seleccionar Departamento --</option>
                                {departments.map((d: any) => (
                                    <option key={d.id} value={d.name}>{d.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Sueldo Mensual (Bs.)</Label>
                            <Input name="baseSalary" type="number" step="0.01" required className="h-9 font-mono font-bold" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Fecha de Ingreso</Label>
                            <Input name="hireDate" type="date" required className="h-9" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Banco</Label>
                            <select name="bankName" className="w-full flex h-9 rounded-sm border border-[#d2d0ce] bg-white px-3 py-2 text-xs">
                                <option value="BANESCO">BANESCO</option>
                                <option value="PROVINCIAL">BBVA PROVINCIAL</option>
                                <option value="MERCANTIL">MERCANTIL</option>
                                <option value="VENEZUELA">BANCO DE VENEZUELA</option>
                                <option value="OTRO">OTRO / PAGO MÓVIL</option>
                            </select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Número de Cuenta (20 dígitos)</Label>
                            <Input name="accountNumber" placeholder="0134..." className="h-9 font-mono" maxLength={20} />
                        </div>

                        <div className="md:col-span-3 flex justify-end">
                            <Button type="submit" disabled={isPending} className="bg-[#107c10] hover:bg-[#0b5a0b] min-w-[150px]">
                                {isPending ? <Loader2 className="animate-spin w-4 h-4" /> : "Guardar Empleado"}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white border border-[#e1dfdd] rounded-sm shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#f3f2f1]">
                        <TableRow>
                            <TableHead className="w-[300px] text-xs font-bold text-[#605e5c]">TRABAJADOR</TableHead>
                            <TableHead className="text-xs font-bold text-[#605e5c]">CARGO / DEPTO</TableHead>
                            <TableHead className="text-xs font-bold text-[#605e5c]">FECHA INGRESO</TableHead>
                            <TableHead className="text-xs font-bold text-[#605e5c]">DATOS BANCARIOS</TableHead>
                            <TableHead className="text-right text-xs font-bold text-[#605e5c]">SUELDO BASE</TableHead>
                            <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialEmployees.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-[#a19f9d] italic">
                                    No hay empleados registrados.
                                </TableCell>
                            </TableRow>
                        ) : (
                            initialEmployees.map((emp) => (
                                <TableRow key={emp.id} className="hover:bg-[#faf9f8]">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-[#323130] uppercase text-sm">{emp.lastName}, {emp.firstName}</span>
                                            <span className="text-[10px] font-mono text-[#605e5c]">{emp.nationality}-{emp.idNumber}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-[#323130]">{emp.position || "N/A"}</span>
                                            <span className="text-[10px] text-[#605e5c] uppercase">{emp.department || "General"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-[#605e5c]">
                                        {new Date(emp.hireDate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-[#0078d4]">{emp.bankName || "NO ASIGNADO"}</span>
                                            <span className="text-[10px] font-mono text-[#605e5c] tracking-tighter">{emp.accountNumber || "--"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-black text-[#107c10] font-mono">
                                        Bs. {emp.baseSalary.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[#0078d4]">
                                            <Search className="w-4 h-4" />
                                        </Button>
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
