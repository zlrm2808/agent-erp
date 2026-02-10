"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/zod-resolver";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCompanyAction } from "./actions";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const createCompanySchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    rif: z.string().min(5, "El RIF debe ser válido (Ej. J-12345678-9)"),
    address: z.string().min(10, "La dirección debe ser detallada (mín. 10 caracteres)"),
    phone: z.string().optional(),
});

type CreateCompanyValues = z.infer<typeof createCompanySchema>;

export function CreateCompanyForm({ onSuccess }: { onSuccess: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<CreateCompanyValues>({
        resolver: zodResolver(createCompanySchema),
        defaultValues: {
            name: "",
            rif: "",
            address: "",
            phone: "",
        },
    });

    async function onSubmit(data: CreateCompanyValues) {
        setIsLoading(true);
        setError(null);
        try {
            const result = await createCompanyAction(data);
            if (result.error) {
                setError(result.error);
            } else {
                form.reset();
                onSuccess();
            }
        } catch (err) {
            setError("Error al crear la empresa.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto px-1">
            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                    {error}
                </div>
            )}
            <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Empresa</Label>
                <Input id="name" {...form.register("name")} placeholder="Ej. Inversiones 2024 C.A." />
                {form.formState.errors.name && (
                    <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="rif">RIF (ID Fiscal)</Label>
                <Input id="rif" {...form.register("rif")} placeholder="Ej. J-12345678-9" />
                {form.formState.errors.rif && (
                    <p className="text-xs text-red-500">{form.formState.errors.rif.message}</p>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="address">Dirección Fiscal Completa</Label>
                <Input id="address" {...form.register("address")} placeholder="Av, Calle, Edif, Local..." />
                {form.formState.errors.address && (
                    <p className="text-xs text-red-500">{form.formState.errors.address.message}</p>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone">Teléfono de Contacto (Opcional)</Label>
                <Input id="phone" {...form.register("phone")} placeholder="Ej. 0212-1234567" />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Crear Empresa e Inicializar Base de Datos"}
            </Button>
        </form>
    );
}
