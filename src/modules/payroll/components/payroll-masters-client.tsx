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
import { Building2, Briefcase, Plus, Loader2, CheckCircle } from "lucide-react";
import { createDepartmentAction, createPositionAction } from "../actions";
import { toast } from "@/lib/toast";

interface PayrollMastersClientProps {
    companyId: string;
    initialDepartments: any[];
    initialPositions: any[];
}

function MasterSection({
    title,
    icon: Icon,
    color,
    items,
    entityLabel,
    onAdd
}: {
    title: string;
    icon: React.ElementType;
    color: string;
    items: any[];
    entityLabel: string;
    onAdd: (name: string) => Promise<{ success?: boolean; error?: string }>;
}) {
    const [value, setValue] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!value.trim()) return;
        startTransition(async () => {
            const res = await onAdd(value.trim());
            if (res.success) {
                toast({ title: `${entityLabel} registrado`, description: `"${value.trim()}" fue agregado correctamente.` });
                setValue("");
            } else {
                toast({ title: "Error", description: res.error, variant: "destructive" });
            }
        });
    };

    return (
        <div className="bg-white border border-[#e1dfdd] rounded-sm shadow-sm overflow-hidden">
            {/* Header */}
            <div className={`flex items-center gap-3 px-5 py-4 border-b border-[#e1dfdd] bg-[#faf9f8] relative overflow-hidden`}>
                <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: color }} />
                <div className="p-2 rounded-full" style={{ backgroundColor: `${color}18` }}>
                    <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#323130]">{title}</h3>
                    <p className="text-[10px] text-[#605e5c]">{items.length} {items.length === 1 ? "registro" : "registros"}</p>
                </div>
            </div>

            {/* Add form */}
            <form onSubmit={handleSubmit} className="flex items-end gap-3 px-5 py-4 border-b border-[#f3f2f1]">
                <div className="flex-1 space-y-1">
                    <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Nombre</Label>
                    <Input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder={`Ej. ${entityLabel === "Departamento" ? "Administración" : "Contador I"}`}
                        className="h-8 text-xs"
                        required
                    />
                </div>
                <Button type="submit" disabled={isPending} size="sm" className="h-8 gap-1 text-xs" style={{ backgroundColor: color }}>
                    {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                    Agregar
                </Button>
            </form>

            {/* List */}
            <Table>
                <TableHeader className="bg-[#f3f2f1]">
                    <TableRow>
                        <TableHead className="text-[10px] font-bold text-[#605e5c] uppercase">Nombre</TableHead>
                        <TableHead className="text-[10px] font-bold text-[#605e5c] uppercase w-24">Estado</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={2} className="h-24 text-center text-xs text-[#a19f9d] italic">
                                No hay registros. Agregue el primero arriba.
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => (
                            <TableRow key={item.id} className="hover:bg-[#faf9f8]">
                                <TableCell className="text-sm font-medium text-[#323130]">{item.name}</TableCell>
                                <TableCell>
                                    <span className="flex items-center gap-1 text-[10px] text-[#107c10] font-bold">
                                        <CheckCircle className="w-3 h-3" />
                                        ACTIVO
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

export function PayrollMastersClient({ companyId, initialDepartments, initialPositions }: PayrollMastersClientProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MasterSection
                    title="Maestro de Departamentos"
                    icon={Building2}
                    color="#0078d4"
                    items={initialDepartments}
                    entityLabel="Departamento"
                    onAdd={(name) => createDepartmentAction(companyId, name)}
                />
                <MasterSection
                    title="Maestro de Cargos"
                    icon={Briefcase}
                    color="#8764b8"
                    items={initialPositions}
                    entityLabel="Cargo"
                    onAdd={(name) => createPositionAction(companyId, name)}
                />
            </div>
        </div>
    );
}
