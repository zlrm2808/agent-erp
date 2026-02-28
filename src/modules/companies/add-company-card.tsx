"use client";

import { useState } from "react";
import { Plus, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CreateCompanyForm } from "./create-company-form";

export function AddCompanyCard() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Card className="h-full border-2 border-dashed border-slate-200 shadow-none hover:border-primary/50 hover:bg-primary/[0.02] cursor-pointer transition-all flex flex-col items-center justify-center p-8 gap-4 min-h-[160px]">
                    <div className="p-3 bg-slate-50 rounded-full border border-slate-100 group-hover:bg-white">
                        <Plus className="text-slate-400" />
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-slate-900">Nueva Empresa</p>
                        <p className="text-xs text-slate-500">Registrar entidad adicional</p>
                    </div>
                </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Briefcase size={20} className="text-primary" />
                        Registrar Nueva Empresa
                    </DialogTitle>
                    <DialogDescription>
                        Ingresa los datos fiscales y registra al menos una sucursal inicial para la empresa.
                    </DialogDescription>
                </DialogHeader>
                <CreateCompanyForm onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}
