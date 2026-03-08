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
import { Loader2, Edit } from "lucide-react";
import { updateUserAction } from "@/modules/users/actions";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface EditUserProps {
    companyId: string;
    user: any;
    profiles: any[];
}

export function EditUserDialog({ companyId, user, profiles }: EditUserProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await updateUserAction(user.id, companyId, formData);

        if (result.success) {
            toast.success("Usuario actualizado con éxito");
            setOpen(false);
        } else {
            toast.error(`Error: ${result.error}`);
        }
        setLoading(false);
    };

    const currentProfileId = user.companies[0]?.profileId || profiles.find(p => p.name === "Operador")?.id;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="text-[#0078d4] hover:underline font-bold text-[11px] uppercase tracking-wider">
                    Editar
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase tracking-tight text-[#323130]">Editar Usuario</DialogTitle>
                        <DialogDescription className="text-xs">
                            Modifique los datos del usuario. El nombre de usuario no puede ser cambiado.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-1 opacity-70">
                            <label className="text-[10px] font-bold uppercase text-[#605e5c]">Usuario (Login)</label>
                            <Input value={user.username} disabled />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-[#605e5c]">Nombre Completo</label>
                            <Input name="realName" defaultValue={user.realName} required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-[#605e5c]">Nueva Contraseña (Opcional)</label>
                            <Input name="password" type="password" placeholder="Dejar en blanco para no cambiar" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-[#605e5c]">Cargo</label>
                                <Input name="position" defaultValue={user.position} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-[#605e5c]">Departamento</label>
                                <Input name="department" defaultValue={user.department} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-[#605e5c]">Perfil de Usuario</label>
                            <Select name="profileId" defaultValue={currentProfileId}>
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
                        <div className="flex items-center space-x-2 pt-2">
                            <Switch id="isActive" name="isActive" defaultChecked={user.isActive} />
                            <Label htmlFor="isActive" className="text-xs font-bold uppercase text-[#605e5c]">Estado Activo</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading} className="w-full bg-[#0078d4] font-bold uppercase tracking-widest text-xs h-10">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Guardar Cambios"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
