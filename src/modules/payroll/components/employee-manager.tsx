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
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Users,
    Search,
    Loader2,
    BadgeCent,
    User,
    Briefcase,
    Phone,
    Landmark,
    HeartPulse,
    CreditCard,
    Baby,
    Plus,
    Trash2
} from "lucide-react";
import { createEmployeeAction } from "../actions";
import { toast } from "@/lib/toast";

export function EmployeeManager({
    companyId,
    initialEmployees = [],
    departments = [],
    positions = [],
    concepts = [],
    forceShowForm = false,
    onFormClose
}: {
    companyId: string,
    initialEmployees: any[],
    departments?: any[],
    positions?: any[],
    concepts?: any[],
    forceShowForm?: boolean,
    onFormClose?: () => void
}) {
    const [isPending, startTransition] = useTransition();
    const [editingEmployee, setEditingEmployee] = useState<any>(null);
    const [showConceptDialog, setShowConceptDialog] = useState(false);
    const [showFamilyDialog, setShowFamilyDialog] = useState(false);
    const [tempDependents, setTempDependents] = useState<any[]>([]);

    const handleAddTempDependent = (e: React.MouseEvent) => {
        e.preventDefault();
        const firstName = (document.getElementById("dep-firstName") as HTMLInputElement).value;
        const lastName = (document.getElementById("dep-lastName") as HTMLInputElement).value;
        const relationship = (document.getElementById("dep-relationship") as HTMLSelectElement).value;
        const birthDate = (document.getElementById("dep-birthDate") as HTMLInputElement).value;
        const idNumber = (document.getElementById("dep-idNumber") as HTMLInputElement).value;
        const gender = (document.getElementById("dep-gender") as HTMLSelectElement).value;

        if (!firstName || !lastName || !relationship || !birthDate) {
            toast({ title: "Datos Incompletos", description: "Por favor complete los campos obligatorios del familiar.", variant: "destructive" });
            return;
        }

        const newDep = {
            firstName,
            lastName,
            relationship,
            birthDate,
            idNumber: idNumber || null,
            gender
        };

        setTempDependents([...tempDependents, newDep]);

        // Reset form
        (document.getElementById("dep-firstName") as HTMLInputElement).value = "";
        (document.getElementById("dep-lastName") as HTMLInputElement).value = "";
        (document.getElementById("dep-birthDate") as HTMLInputElement).value = "";
        (document.getElementById("dep-idNumber") as HTMLInputElement).value = "";
    };

    const handleRemoveTempDependent = (index: number) => {
        setTempDependents(tempDependents.filter((_, i) => i !== index));
    };

    const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        const data: any = Object.fromEntries(formData.entries());

        // Handle checkboxes (deductSSO, deductFAOV)
        data.deductSSO = formData.get("deductSSO") === "on" ? "true" : "false";
        data.deductFAOV = formData.get("deductFAOV") === "on" ? "true" : "false";

        // Include dependents
        data.familyDependents = tempDependents;

        startTransition(async () => {
            const res = await createEmployeeAction(companyId, data);
            if (res.success) {
                toast({ title: "Empleado Registrado", description: "El trabajador ha sido añadido a la nómina con éxito." });
                form.reset();
                if (onFormClose) onFormClose();
            } else {
                toast({ title: "Error", description: res.error, variant: "destructive" });
            }
        });
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center bg-white p-4 border border-[#e1dfdd] rounded-sm shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0078d4]" />
                <div className="flex items-center gap-3">
                    <div className="bg-[#0078d4]/10 p-2 rounded-full">
                        <Users className="text-[#0078d4] w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#323130] uppercase text-xs tracking-wider">Maestro de Personal</h3>
                        <p className="text-[10px] text-[#605e5c]">Ficha técnica detallada de trabajadores activos.</p>
                    </div>
                </div>
                {forceShowForm && (
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

            {forceShowForm && (
                <div className="bg-white border border-[#e1dfdd] rounded-sm shadow-md animate-in slide-in-from-top-4 duration-300 overflow-hidden">
                    <form onSubmit={handleCreate}>
                        <Tabs defaultValue="personal" className="w-full">
                            <div className="bg-[#f3f2f1] border-b border-[#e1dfdd] px-4">
                                <TabsList className="bg-transparent h-12 gap-4">
                                    <TabsTrigger value="personal" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#0078d4] h-12 rounded-none bg-transparent text-xs font-bold uppercase gap-2">
                                        <User size={14} /> Identificación
                                    </TabsTrigger>
                                    <TabsTrigger value="job" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#0078d4] h-12 rounded-none bg-transparent text-xs font-bold uppercase gap-2">
                                        <Briefcase size={14} /> Datos Laborales
                                    </TabsTrigger>
                                    <TabsTrigger value="contact" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#0078d4] h-12 rounded-none bg-transparent text-xs font-bold uppercase gap-2">
                                        <Phone size={14} /> Contacto
                                    </TabsTrigger>
                                    <TabsTrigger value="benefits" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#0078d4] h-12 rounded-none bg-transparent text-xs font-bold uppercase gap-2">
                                        <Landmark size={14} /> Banco y Beneficios
                                    </TabsTrigger>
                                    <TabsTrigger value="other" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#0078d4] h-12 rounded-none bg-transparent text-xs font-bold uppercase gap-2">
                                        <HeartPulse size={14} /> Salud y Otros
                                    </TabsTrigger>
                                    <TabsTrigger value="family" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#0078d4] h-12 rounded-none bg-transparent text-xs font-bold uppercase gap-2">
                                        <Baby size={14} /> Carga Familiar
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="p-6">
                                <TabsContent value="personal" className="grid grid-cols-1 md:grid-cols-4 gap-6 m-0">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Código Empleado</Label>
                                        <Input name="employeeCode" placeholder="EMP-001" className="h-8 text-xs font-mono" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Nacionalidad</Label>
                                        <select name="nationality" className="w-full h-8 border border-[#d2d0ce] bg-white px-2 py-1 text-xs">
                                            <option value="V">Venezolano</option>
                                            <option value="E">Extranjero</option>
                                            <option value="P">Pasaporte</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Cédula / RIF</Label>
                                        <Input name="idNumber" placeholder="V-12345678" required className="h-8 text-xs font-mono" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">RIF Adicional</Label>
                                        <Input name="rif" placeholder="J-12345678-0" className="h-8 text-xs font-mono" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">1er Nombre</Label>
                                        <Input name="firstName" required className="h-8 text-xs" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">2do Nombre</Label>
                                        <Input name="middleName" className="h-8 text-xs" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">1er Apellido</Label>
                                        <Input name="lastName" required className="h-8 text-xs" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">2do Apellido</Label>
                                        <Input name="secondLastName" className="h-8 text-xs" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Fecha Nacimiento</Label>
                                        <Input name="birthDate" type="date" className="h-8 text-xs" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Lugar Nacimiento</Label>
                                        <Input name="birthPlace" className="h-8 text-xs" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Género</Label>
                                        <select name="gender" className="w-full h-8 border border-[#d2d0ce] bg-white px-2 py-1 text-xs">
                                            <option value="M">Masculino</option>
                                            <option value="F">Femenino</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Estado Civil</Label>
                                        <select name="maritalStatus" className="w-full h-8 border border-[#d2d0ce] bg-white px-2 py-1 text-xs">
                                            <option value="SOLTERO">Soltero/a</option>
                                            <option value="CASADO">Casado/a</option>
                                            <option value="DIVORCIADO">Divorciado/a</option>
                                            <option value="VIUDO">Viudo/a</option>
                                        </select>
                                    </div>
                                </TabsContent>

                                <TabsContent value="job" className="grid grid-cols-1 md:grid-cols-4 gap-6 m-0">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Departamento</Label>
                                        <select name="department" className="w-full h-8 border border-[#d2d0ce] bg-white px-2 py-1 text-xs">
                                            <option value="">-- Seleccionar --</option>
                                            {departments.map((d: any) => <option key={d.id} value={d.name}>{d.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Cargo</Label>
                                        <select name="position" className="w-full h-8 border border-[#d2d0ce] bg-white px-2 py-1 text-xs">
                                            <option value="">-- Seleccionar --</option>
                                            {positions.map((p: any) => <option key={p.id} value={p.name}>{p.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Condición</Label>
                                        <select name="employeeCondition" className="w-full h-8 border border-[#d2d0ce] bg-white px-2 py-1 text-xs">
                                            <option value="ACTIVO">Activo</option>
                                            <option value="INACTIVO">Inactivo</option>
                                            <option value="CONTRATADO">Contratado</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Tipo de Nómina</Label>
                                        <select name="payrollType" className="w-full h-8 border border-[#d2d0ce] bg-white px-2 py-1 text-xs">
                                            <option value="QUINCENAL">Quincenal</option>
                                            <option value="SEMANAL">Semanal</option>
                                            <option value="MENSUAL">Mensual</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Fecha Ingreso</Label>
                                        <Input name="hireDate" type="date" required className="h-8 text-xs" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Sueldo Mensual</Label>
                                        <Input name="baseSalary" type="number" step="0.01" required className="h-8 text-xs font-bold text-[#107c10]" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Turno / Horario</Label>
                                        <select name="shift" className="w-full h-8 border border-[#d2d0ce] bg-white px-2 py-1 text-xs">
                                            <option value="DIURNO">Diurno</option>
                                            <option value="NOCTURNO">Nocturno</option>
                                            <option value="MIXTO">Mixto</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Categoría</Label>
                                        <select name="category" className="w-full h-8 border border-[#d2d0ce] bg-white px-2 py-1 text-xs">
                                            <option value="EMPLEADO">Empleado</option>
                                            <option value="OBRERO">Obrero</option>
                                            <option value="DIRECTIVO">Directivo</option>
                                        </select>
                                    </div>
                                </TabsContent>

                                <TabsContent value="contact" className="grid grid-cols-1 md:grid-cols-4 gap-6 m-0">
                                    <div className="md:col-span-2 space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Dirección de Habitación 1</Label>
                                        <Input name="address" className="h-8 text-xs" />
                                    </div>
                                    <div className="md:col-span-2 space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Dirección 2</Label>
                                        <Input name="address2" className="h-8 text-xs" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Teléfono 1</Label>
                                        <Input name="phone" className="h-8 text-xs" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Teléfono 2</Label>
                                        <Input name="phone2" className="h-8 text-xs" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Celular</Label>
                                        <Input name="mobilePhone" className="h-8 text-xs" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Email Personal</Label>
                                        <Input name="email" type="email" className="h-8 text-xs" />
                                    </div>
                                </TabsContent>

                                <TabsContent value="benefits" className="grid grid-cols-1 md:grid-cols-4 gap-6 m-0">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Banco</Label>
                                        <Input name="bankName" className="h-8 text-xs uppercase" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Número de Cuenta</Label>
                                        <Input name="accountNumber" className="h-8 text-xs font-mono" maxLength={20} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Forma de Pago</Label>
                                        <select name="paymentMethod" className="w-full h-8 border border-[#d2d0ce] bg-white px-2 py-1 text-xs">
                                            <option value="DEPOSITO">Depósito Bancario</option>
                                            <option value="EFECTIVO">Efectivo</option>
                                            <option value="PAGO_MOVIL">Pago Móvil</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Retener ISLR (%)</Label>
                                        <Input name="islrPercentage" type="number" step="0.01" className="h-8 text-xs font-bold text-amber-600" defaultValue="0" />
                                    </div>

                                    <div className="flex items-center gap-2 pt-4">
                                        <input type="checkbox" name="deductSSO" id="deductSSO" defaultChecked className="w-4 h-4" />
                                        <Label htmlFor="deductSSO" className="text-[10px] font-bold uppercase text-[#605e5c] cursor-pointer">Deducir SSO y Paro Forzoso</Label>
                                    </div>
                                    <div className="flex items-center gap-2 pt-4">
                                        <input type="checkbox" name="deductFAOV" id="deductFAOV" defaultChecked className="w-4 h-4" />
                                        <Label htmlFor="deductFAOV" className="text-[10px] font-bold uppercase text-[#605e5c] cursor-pointer">Descontar FAOV</Label>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Caja de Ahorro (%)</Label>
                                        <Input name="savingsEmployeeContribution" type="number" step="0.01" className="h-8 text-xs" defaultValue="0" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Retención HCM</Label>
                                        <Input name="hcmRetention" type="number" step="0.01" className="h-8 text-xs" defaultValue="0" />
                                    </div>
                                </TabsContent>

                                <TabsContent value="other" className="grid grid-cols-1 md:grid-cols-4 gap-6 m-0">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Estatura (Metros)</Label>
                                        <Input name="height" type="number" step="0.01" className="h-8 text-xs" defaultValue="0" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Peso (Kilos)</Label>
                                        <Input name="weight" type="number" className="h-8 text-xs" defaultValue="0" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Mano Dominante</Label>
                                        <select name="handedness" className="w-full h-8 border border-[#d2d0ce] bg-white px-2 py-1 text-xs">
                                            <option value="DIESTRO">Diestro</option>
                                            <option value="ZURDO">Zurdo</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Capta Huella ID</Label>
                                        <Input name="fingerprintId" className="h-8 text-xs font-mono" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Servicio Militar</Label>
                                        <Input name="militaryService" className="h-8 text-xs" />
                                    </div>
                                </TabsContent>

                                <TabsContent value="family" className="space-y-6 m-0">
                                    <div className="bg-[#fcfcfb] border border-[#e1dfdd] p-4 space-y-4">
                                        <h4 className="text-[10px] font-black uppercase text-[#0078d4] tracking-widest">Añadir Nuevo Familiar</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div className="space-y-1">
                                                <Label className="text-[10px] font-bold uppercase">Nombre</Label>
                                                <Input id="dep-firstName" className="h-8 text-xs" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-[10px] font-bold uppercase">Apellido</Label>
                                                <Input id="dep-lastName" className="h-8 text-xs" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-[10px] font-bold uppercase">Parentesco</Label>
                                                <select id="dep-relationship" className="w-full h-8 border border-[#d2d0ce] bg-white px-2 py-1 text-xs">
                                                    <option value="HIJO">Hijo/a</option>
                                                    <option value="CONYUGE">Cónyuge</option>
                                                    <option value="PADRE">Padre</option>
                                                    <option value="MADRE">Madre</option>
                                                    <option value="HERMANO">Hermano/a</option>
                                                    <option value="OTRO">Otro</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-[10px] font-bold uppercase">Nacimiento</Label>
                                                <Input id="dep-birthDate" type="date" className="h-8 text-xs" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-[10px] font-bold uppercase">Cédula (Opcional)</Label>
                                                <Input id="dep-idNumber" className="h-8 text-xs" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-[10px] font-bold uppercase">Sexo</Label>
                                                <select id="dep-gender" className="w-full h-8 border border-[#d2d0ce] bg-white px-2 py-1 text-xs">
                                                    <option value="M">Masculino</option>
                                                    <option value="F">Femenino</option>
                                                </select>
                                            </div>
                                            <div className="md:col-span-2 flex items-end">
                                                <Button type="button" onClick={handleAddTempDependent} className="w-full h-8 bg-[#0078d4] text-[10px] gap-2">
                                                    <Plus size={14} /> AGREGAR FAMILIAR
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4">
                                        <h4 className="text-[10px] font-black uppercase text-[#605e5c] tracking-widest flex items-center gap-2">
                                            Familiares en Lista ({tempDependents.length})
                                        </h4>
                                        <Table>
                                            <TableHeader className="bg-[#f3f2f1]">
                                                <TableRow>
                                                    <TableHead className="text-[10px] uppercase">Nombre y Apellido</TableHead>
                                                    <TableHead className="text-[10px] uppercase">Parentesco</TableHead>
                                                    <TableHead className="text-[10px] uppercase">Edad</TableHead>
                                                    <TableHead className="text-[10px] uppercase">Cédula</TableHead>
                                                    <TableHead className="w-10"></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {tempDependents.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="text-center text-xs text-[#a19f9d] py-8 italic">No se han añadido familiares aún.</TableCell>
                                                    </TableRow>
                                                ) : (
                                                    tempDependents.map((dep, idx) => {
                                                        const age = Math.floor((new Date().getTime() - new Date(dep.birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
                                                        return (
                                                            <TableRow key={idx}>
                                                                <TableCell className="text-xs font-bold uppercase">{dep.firstName} {dep.lastName}</TableCell>
                                                                <TableCell className="text-[10px] font-bold text-[#0078d4]">{dep.relationship}</TableCell>
                                                                <TableCell className="text-xs">{age} años</TableCell>
                                                                <TableCell className="text-xs font-mono">{dep.idNumber || "N/A"}</TableCell>
                                                                <TableCell>
                                                                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-rose-600" onClick={() => handleRemoveTempDependent(idx)}>
                                                                        <Trash2 size={14} />
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </TabsContent>
                            </div>

                            <div className="bg-[#f3f2f1] border-t border-[#e1dfdd] p-4 flex justify-end">
                                <Button type="submit" disabled={isPending} className="bg-[#107c10] hover:bg-[#0b5a0b] uppercase font-black text-xs tracking-tighter px-8 h-10 shadow-lg">
                                    {isPending ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : "Guardar Ficha Técnica"}
                                </Button>
                            </div>
                        </Tabs>
                    </form>
                </div>
            )}

            <div className="bg-white border border-[#e1dfdd] rounded-sm shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#f3f2f1]">
                        <TableRow>
                            <TableHead className="w-[300px] text-xs font-bold text-[#605e5c]">TRABAJADOR</TableHead>
                            <TableHead className="text-xs font-bold text-[#605e5c]">CARGO / DEPTO</TableHead>
                            <TableHead className="text-xs font-bold text-[#605e5c]">TIPO NOMINA</TableHead>
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
                                            <span className="font-bold text-[#323130] uppercase text-sm">
                                                {emp.lastName}{emp.secondLastName ? ` ${emp.secondLastName}` : ""}, {emp.firstName}
                                            </span>
                                            <span className="text-[10px] font-mono text-[#605e5c]">{emp.nationality}-{emp.idNumber} | {emp.employeeCode || "S/C"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-[#323130]">{emp.position || "N/A"}</span>
                                            <span className="text-[10px] text-[#605e5c] uppercase">{emp.department || "General"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-[10px] font-bold text-[#8764b8] bg-[#f4f2f8] px-2 py-0.5 rounded-full uppercase">
                                            {emp.payrollType || "Quincenal"}
                                        </span>
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
                                        <div className="flex gap-1 justify-end">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-[#107c10]"
                                                onClick={() => {
                                                    setEditingEmployee(emp);
                                                    setShowConceptDialog(true);
                                                }}
                                                title="Asignar Conceptos"
                                            >
                                                <BadgeCent className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-[#0078d4]"
                                                onClick={() => {
                                                    setEditingEmployee(emp);
                                                    setShowFamilyDialog(true);
                                                }}
                                                title="Carga Familiar"
                                            >
                                                <Baby className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#605e5c]">
                                                <Search className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Concept Assignment Dialog (Simplified for now as a conditional section) */}
            {showConceptDialog && editingEmployee && (
                <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-sm shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-[#f3f2f1] px-5 py-3 border-b border-[#e1dfdd] flex justify-between items-center">
                            <h3 className="text-xs font-bold uppercase text-[#323130]">Asignaciones y Deducciones Fijas: {editingEmployee.firstName} {editingEmployee.lastName}</h3>
                            <Button variant="ghost" size="sm" onClick={() => setShowConceptDialog(false)} className="h-6 w-6 p-0">×</Button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-[#f3f2f1]">
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Concepto</Label>
                                    <select id="new-concept-id" className="w-full flex h-8 rounded-sm border border-[#d2d0ce] bg-white px-2 py-1 text-xs">
                                        {concepts.map((c: any) => (
                                            <option key={c.id} value={c.id}>[{c.code}] {c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-bold uppercase text-[#605e5c]">Monto Mensual (Bs.)</Label>
                                    <Input id="new-concept-amount" type="number" step="0.01" className="h-8 text-xs font-bold" defaultValue="0.00" />
                                </div>
                                <Button
                                    className="h-8 bg-[#107c10] hover:bg-[#0b5a0b] text-xs"
                                    onClick={async () => {
                                        const conceptId = (document.getElementById("new-concept-id") as HTMLSelectElement).value;
                                        const amount = parseFloat((document.getElementById("new-concept-amount") as HTMLInputElement).value);

                                        startTransition(async () => {
                                            const res = await (require("../actions").assignConceptAction(companyId, {
                                                employeeId: editingEmployee.id,
                                                conceptId,
                                                amount
                                            }));
                                            if (res.success) {
                                                toast({ title: "Concepto Asignado" });
                                                window.location.reload();
                                            } else {
                                                toast({ title: "Error", description: res.error, variant: "destructive" });
                                            }
                                        });
                                    }}
                                >
                                    Vincular
                                </Button>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-[10px] font-bold uppercase text-[#605e5c]">Conceptos Asignados Actualmente</h4>
                                <Table>
                                    <TableHeader className="bg-[#faf9f8]">
                                        <TableRow>
                                            <TableHead className="text-[10px] uppercase">Código</TableHead>
                                            <TableHead className="text-[10px] uppercase">Concepto</TableHead>
                                            <TableHead className="text-[10px] uppercase text-right">Monto</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {(editingEmployee.fixedConcepts || []).length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center text-xs text-[#a19f9d] py-4">No tiene conceptos fijos asignados.</TableCell>
                                            </TableRow>
                                        ) : (
                                            editingEmployee.fixedConcepts.map((ec: any) => (
                                                <TableRow key={ec.id}>
                                                    <TableCell className="text-xs font-bold">{ec.concept.code}</TableCell>
                                                    <TableCell className="text-xs">{ec.concept.name}</TableCell>
                                                    <TableCell className="text-xs font-bold text-right">Bs. {ec.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                        <div className="bg-[#f3f2f1] px-5 py-3 flex justify-end">
                            <Button size="sm" onClick={() => setShowConceptDialog(false)}>Cerrar</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Family Dependents Dialog */}
            {showFamilyDialog && editingEmployee && (
                <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-sm shadow-xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-[#f3f2f1] px-5 py-3 border-b border-[#e1dfdd] flex justify-between items-center">
                            <h3 className="text-xs font-bold uppercase text-[#323130]">Gestión de Carga Familiar: {editingEmployee.firstName} {editingEmployee.lastName}</h3>
                            <Button variant="ghost" size="sm" onClick={() => setShowFamilyDialog(false)} className="h-6 w-6 p-0">×</Button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="bg-[#fcfcfb] border border-[#e1dfdd] p-4 space-y-4">
                                <h4 className="text-[10px] font-black uppercase text-[#0078d4] tracking-widest">Registrar Familiar</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase">Nombre</Label>
                                        <Input id="new-dep-firstName" className="h-8 text-xs" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase">Apellido</Label>
                                        <Input id="new-dep-lastName" className="h-8 text-xs" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase">Parentesco</Label>
                                        <select id="new-dep-relationship" className="w-full h-8 border border-[#d2d0ce] bg-white px-2 py-1 text-xs">
                                            <option value="HIJO">Hijo/a</option>
                                            <option value="CONYUGE">Cónyuge</option>
                                            <option value="PADRE">Padre</option>
                                            <option value="MADRE">Madre</option>
                                            <option value="HERMANO">Hermano/a</option>
                                            <option value="OTRO">Otro</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase">Nacimiento</Label>
                                        <Input id="new-dep-birthDate" type="date" className="h-8 text-xs" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase">Cédula</Label>
                                        <Input id="new-dep-idNumber" className="h-8 text-xs" />
                                    </div>
                                    <div className="flex items-end">
                                        <Button
                                            className="w-full h-8 bg-[#107c10] hover:bg-[#0b5a0b] text-xs gap-2"
                                            onClick={async () => {
                                                const firstName = (document.getElementById("new-dep-firstName") as HTMLInputElement).value;
                                                const lastName = (document.getElementById("new-dep-lastName") as HTMLInputElement).value;
                                                const relationship = (document.getElementById("new-dep-relationship") as HTMLSelectElement).value;
                                                const birthDate = (document.getElementById("new-dep-birthDate") as HTMLInputElement).value;
                                                const idNumber = (document.getElementById("new-dep-idNumber") as HTMLInputElement).value;

                                                if (!firstName || !lastName || !birthDate) return;

                                                startTransition(async () => {
                                                    const res = await (require("../actions").addFamilyDependentAction(companyId, {
                                                        employeeId: editingEmployee.id,
                                                        firstName,
                                                        lastName,
                                                        relationship,
                                                        birthDate,
                                                        idNumber: idNumber || null
                                                    }));
                                                    if (res.success) {
                                                        toast({ title: "Familiar Agregado" });
                                                        window.location.reload();
                                                    } else {
                                                        toast({ title: "Error", description: res.error, variant: "destructive" });
                                                    }
                                                });
                                            }}
                                        >
                                            <Plus size={14} /> Vincular
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-[10px] font-bold uppercase text-[#605e5c]">Carga Familiar Actual ({editingEmployee.familyDependents?.length || 0})</h4>
                                <Table>
                                    <TableHeader className="bg-[#faf9f8]">
                                        <TableRow>
                                            <TableHead className="text-[10px] uppercase">Familiar</TableHead>
                                            <TableHead className="text-[10px] uppercase">Parentesco</TableHead>
                                            <TableHead className="text-[10px] uppercase text-right">Acción</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {(editingEmployee.familyDependents || []).length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center text-xs text-[#a19f9d] py-4">No tiene carga familiar registrada.</TableCell>
                                            </TableRow>
                                        ) : (
                                            editingEmployee.familyDependents.map((dep: any) => (
                                                <TableRow key={dep.id}>
                                                    <TableCell className="text-xs font-bold uppercase">{dep.firstName} {dep.lastName}</TableCell>
                                                    <TableCell className="text-[10px] font-bold text-[#0078d4]">{dep.relationship}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 text-rose-600"
                                                            onClick={async () => {
                                                                if (!confirm("¿Eliminar este familiar?")) return;
                                                                startTransition(async () => {
                                                                    const res = await (require("../actions").deleteFamilyDependentAction(companyId, dep.id));
                                                                    if (res.success) {
                                                                        toast({ title: "Familiar Eliminado" });
                                                                        window.location.reload();
                                                                    }
                                                                });
                                                            }}
                                                        >
                                                            <Trash2 size={14} />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                        <div className="bg-[#f3f2f1] px-5 py-3 flex justify-end">
                            <Button size="sm" onClick={() => setShowFamilyDialog(false)}>Cerrar</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
