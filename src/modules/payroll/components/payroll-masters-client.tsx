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
import { Building2, Briefcase, Plus, Loader2, CheckCircle, BadgeCent, Settings, Calculator } from "lucide-react";
import { createDepartmentAction, createPositionAction, createConceptAction, createConstantAction } from "../actions";
import { toast } from "@/lib/toast";

interface PayrollMastersClientProps {
    companyId: string;
    initialDepartments: any[];
    initialPositions: any[];
    initialConcepts: any[];
    initialConstants: any[];
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
        <div className="bg-white border border-[#e1dfdd] rounded-sm shadow-sm overflow-hidden flex flex-col h-full">
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

            <div className="flex-1 overflow-auto max-h-[300px]">
                <Table>
                    <TableHeader className="bg-[#f3f2f1] sticky top-0 z-10">
                        <TableRow>
                            <TableHead className="text-[10px] font-bold text-[#605e5c] uppercase">Nombre</TableHead>
                            <TableHead className="text-[10px] font-bold text-[#605e5c] uppercase w-24">Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} className="h-24 text-center text-xs text-[#a19f9d] italic">
                                    No hay registros.
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((item) => (
                                <TableRow key={item.id} className="hover:bg-[#faf9f8]">
                                    <TableCell className="text-sm font-medium text-[#323130]">{item.name}</TableCell>
                                    <TableCell>
                                        <span className="flex items-center gap-1 text-[10px] text-[#107c10] font-bold uppercase leading-none">
                                            <CheckCircle className="w-3 h-3" />
                                            Activo
                                        </span>
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

function ConceptSection({ companyId, initialConcepts }: { companyId: string, initialConcepts: any[] }) {
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [type, setType] = useState<"EARNING" | "DEDUCTION">("EARNING");
    const [category, setCategory] = useState<"FIXED" | "FORMULA">("FIXED");
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!code || !name) return;
        startTransition(async () => {
            const res = await createConceptAction(companyId, { code, name, type, category });
            if (res.success) {
                toast({ title: "Concepto creado", description: `El concepto ${code} ha sido registrado.` });
                setCode("");
                setName("");
            } else {
                toast({ title: "Error", description: res.error, variant: "destructive" });
            }
        });
    };

    return (
        <div className="bg-white border border-[#e1dfdd] rounded-sm shadow-sm overflow-hidden flex flex-col h-full lg:col-span-2">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#e1dfdd] bg-[#faf9f8] relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#107c10]" />
                <div className="p-2 rounded-full bg-[#107c1018]">
                    <BadgeCent className="w-4 h-4 text-[#107c10]" />
                </div>
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#323130]">Maestro de Conceptos de Nómina</h3>
                    <p className="text-[10px] text-[#605e5c]">Asignaciones y Deducciones</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-3 px-5 py-4 border-b border-[#f3f2f1] items-end">
                <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Código</Label>
                    <Input value={code} onChange={e => setCode(e.target.value)} placeholder="001" className="h-8 text-xs" required />
                </div>
                <div className="md:col-span-2 space-y-1">
                    <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Nombre del Concepto</Label>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="Bonificación Especial" className="h-8 text-xs" required />
                </div>
                <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Tipo</Label>
                    <Select value={type} onValueChange={(v: any) => setType(v)}>
                        <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="EARNING">Asignación</SelectItem>
                            <SelectItem value="DEDUCTION">Deducción</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button type="submit" disabled={isPending} className="h-8 gap-1 text-xs bg-[#107c10] hover:bg-[#0b590b]">
                    {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                    Crear Concepto
                </Button>
            </form>

            <div className="flex-1 overflow-auto max-h-[400px]">
                <Table>
                    <TableHeader className="bg-[#f3f2f1] sticky top-0 z-10">
                        <TableRow>
                            <TableHead className="text-[10px] font-bold text-[#605e5c] uppercase w-20">Código</TableHead>
                            <TableHead className="text-[10px] font-bold text-[#605e5c] uppercase">Descripción</TableHead>
                            <TableHead className="text-[10px] font-bold text-[#605e5c] uppercase w-24">Tipo</TableHead>
                            <TableHead className="text-[10px] font-bold text-[#605e5c] uppercase w-24">Categoría</TableHead>
                            <TableHead className="text-[10px] font-bold text-[#605e5c] uppercase w-20 text-center">Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialConcepts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-xs text-[#a19f9d] italic">
                                    No hay conceptos definidos.
                                </TableCell>
                            </TableRow>
                        ) : (
                            initialConcepts.map((item) => (
                                <TableRow key={item.id} className="hover:bg-[#faf9f8]">
                                    <TableCell className="text-xs font-bold text-[#323130]">{item.code}</TableCell>
                                    <TableCell className="text-sm text-[#323130] font-medium">{item.name}</TableCell>
                                    <TableCell className="text-xs">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.type === "EARNING" ? "bg-[#dff6dd] text-[#107c10]" : "bg-[#fde7e9] text-[#a4262c]"}`}>
                                            {item.type === "EARNING" ? "Asignación" : "Deducción"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-xs text-[#605e5c]">{item.category}</TableCell>
                                    <TableCell className="text-center">
                                        {item.isStatutory ? (
                                            <span className="text-[10px] font-bold text-[#0078d4] bg-[#eff6fc] px-2 py-0.5 rounded-full">LEY</span>
                                        ) : (
                                            <CheckCircle className="w-4 h-4 text-[#107c10] mx-auto" />
                                        )}
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

function ConstantSection({ companyId, initialConstants }: { companyId: string, initialConstants: any[] }) {
    const [key, setKey] = useState("");
    const [name, setName] = useState("");
    const [value, setValue] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!key || !value) return;
        startTransition(async () => {
            const res = await createConstantAction(companyId, { key: key.toUpperCase(), name, value: parseFloat(value) });
            if (res.success) {
                toast({ title: "Constante guardada", description: `La constante ${key} ha sido actualizada.` });
                setKey("");
                setName("");
                setValue("");
            } else {
                toast({ title: "Error", description: res.error, variant: "destructive" });
            }
        });
    };

    return (
        <div className="bg-white border border-[#e1dfdd] rounded-sm shadow-sm overflow-hidden flex flex-col h-full">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#e1dfdd] bg-[#faf9f8] relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#605e5c]" />
                <div className="p-2 rounded-full bg-[#605e5c18]">
                    <Settings className="w-4 h-4 text-[#605e5c]" />
                </div>
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#323130]">Variables y Constantes</h3>
                    <p className="text-[10px] text-[#605e5c]">Valores globales del sistema</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 px-5 py-4 border-b border-[#f3f2f1]">
                <div className="flex gap-3">
                    <div className="flex-1 space-y-1">
                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Clave (Ej. UT)</Label>
                        <Input value={key} onChange={e => setKey(e.target.value)} placeholder="UT_VENEZUELA" className="h-8 text-xs uppercase" required />
                    </div>
                    <div className="w-24 space-y-1">
                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Valor</Label>
                        <Input type="number" step="0.01" value={value} onChange={e => setValue(e.target.value)} placeholder="0.00" className="h-8 text-xs" required />
                    </div>
                </div>
                <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Descripción</Label>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="Unidad Tributaria Vigente" className="h-8 text-xs" />
                </div>
                <Button type="submit" disabled={isPending} size="sm" className="h-8 gap-1 text-xs bg-[#605e5c] hover:bg-[#323130]">
                    {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                    Guardar Constante
                </Button>
            </form>

            <div className="flex-1 overflow-auto max-h-[300px]">
                <Table>
                    <TableHeader className="bg-[#f3f2f1] sticky top-0 z-10">
                        <TableRow>
                            <TableHead className="text-[10px] font-bold text-[#605e5c] uppercase">Clave</TableHead>
                            <TableHead className="text-[10px] font-bold text-[#605e5c] uppercase text-right">Valor</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialConstants.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} className="h-24 text-center text-xs text-[#a19f9d] italic">
                                    No hay constantes registradas.
                                </TableCell>
                            </TableRow>
                        ) : (
                            initialConstants.map((item) => (
                                <TableRow key={item.id} className="hover:bg-[#faf9f8]">
                                    <TableCell className="text-xs font-bold text-[#323130]">{item.key}</TableCell>
                                    <TableCell className="text-sm font-black text-[#0078d4] text-right">{item.value.toLocaleString()}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export function PayrollMastersClient({ companyId, initialDepartments, initialPositions, initialConcepts, initialConstants }: PayrollMastersClientProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ConceptSection
                    companyId={companyId}
                    initialConcepts={initialConcepts}
                />

                <MasterSection
                    title="Departamentos"
                    icon={Building2}
                    color="#0078d4"
                    items={initialDepartments}
                    entityLabel="Departamento"
                    onAdd={(name) => createDepartmentAction(companyId, name)}
                />
                <MasterSection
                    title="Cargos"
                    icon={Briefcase}
                    color="#8764b8"
                    items={initialPositions}
                    entityLabel="Cargo"
                    onAdd={(name) => createPositionAction(companyId, name)}
                />

                <ConstantSection
                    companyId={companyId}
                    initialConstants={initialConstants}
                />
            </div>
        </div>
    );
}
