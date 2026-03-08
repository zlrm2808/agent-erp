"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { UserPlus, Loader2 } from "lucide-react";
import { createUserAction } from "@/modules/users/actions";
import { toast } from "sonner";

interface UserFormProps {
    companyId: string;
    trigger?: React.ReactNode;
    profiles: any[];
    allCompanies: any[];
}

export function CreateUserDialog({ companyId, trigger, profiles, allCompanies }: UserFormProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await createUserAction(formData, companyId);

        if (result.success) {
            toast.success("Usuario creado con éxito");
            setOpen(false);
        } else {
            toast.error(`Error: ${result.error}`);
        }
        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="bg-[#0078d4] hover:bg-[#005a9e] text-xs font-bold uppercase tracking-widest px-6">
                        <UserPlus className="mr-2 h-4 w-4" /> Crear Usuario
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase tracking-tight text-[#323130]">Nuevo Usuario</DialogTitle>
                        <DialogDescription className="text-xs">
                            Complete los datos para crear un nuevo usuario y darle acceso a esta empresa.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto no-scrollbar">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-[#605e5c]">Usuario (Login)</label>
                            <Input name="username" required placeholder="ej: jdoe" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-[#605e5c]">Nombre Completo</label>
                            <Input name="realName" required placeholder="ej: Juan Pérez" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-[#605e5c]">Contraseña</label>
                            <Input name="password" type="password" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-[#605e5c]">Cargo</label>
                                <Input name="position" placeholder="ej: Contador" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-[#605e5c]">Departamento</label>
                                <Input name="department" placeholder="ej: Administración" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-[#605e5c]">Foto (URL)</label>
                            <Input name="photo" placeholder="https://..." />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-[#605e5c]">Perfil de Usuario</label>
                            <Select name="profileId" defaultValue={profiles.find(p => p.name === "Operador")?.id || profiles[0]?.id}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar perfil" />
                                </SelectTrigger>
                                <SelectContent>
                                    {profiles.map(profile => (
                                        <SelectItem key={profile.id} value={profile.id}>
                                            {profile.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-[#e1dfdd]">
                            <label className="text-[11px] font-black uppercase text-[#323130]">Asignar a Empresas</label>
                            <div className="flex flex-col gap-2">
                                {allCompanies.map((comp) => (
                                    <div key={comp.id} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id={`company-${comp.id}`}
                                            name="companyIds"
                                            value={comp.id}
                                            defaultChecked={comp.id === companyId}
                                            className="w-4 h-4 text-[#0078d4] border-gray-300 rounded focus:ring-[#0078d4]"
                                        />
                                        <label htmlFor={`company-${comp.id}`} className="text-xs font-bold text-[#605e5c] uppercase cursor-pointer">
                                            {comp.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading} className="w-full bg-[#0078d4] font-bold uppercase tracking-widest text-xs h-10 mt-4">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Guardar Usuario"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
