"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Loader2, AlertTriangle } from "lucide-react";
import { deleteUserAction } from "@/modules/users/actions";
import { toast } from "sonner";

interface DeleteUserProps {
    companyId: string;
    userId: string;
    userName: string;
}

export function DeleteUserDialog({ companyId, userId, userName }: DeleteUserProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        const result = await deleteUserAction(userId, companyId);

        if (result.success) {
            toast.success("Usuario removido de la empresa");
            setOpen(false);
        } else {
            toast.error(`Error: ${result.error}`);
        }
        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="text-[#a4262c] hover:underline font-bold text-[11px] uppercase tracking-wider ml-2">
                    Suspender
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-[#a4262c]/20">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black uppercase tracking-tight text-[#a4262c] flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" /> Confirmar Acción
                    </DialogTitle>
                    <DialogDescription className="text-xs pt-2">
                        ¿Estás seguro que deseas remover el acceso de <strong className="text-[#323130]">{userName}</strong> a esta empresa?
                        <br /><br />
                        Esta acción quitará todos sus permisos pero no eliminará su cuenta global del sistema.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                    <Button variant="ghost" onClick={() => setOpen(false)} className="text-xs font-bold uppercase">
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-[#a4262c] hover:bg-[#821d23] font-bold uppercase tracking-widest text-xs"
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirmar Remoción"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
