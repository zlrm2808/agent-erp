"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/zod-resolver";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCompanyAction } from "./actions";
import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";

const createCompanySchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    rif: z.string().min(5, "El RIF debe ser válido (Ej. J-12345678-9)"),
    address: z.string().min(10, "La dirección debe ser detallada (mín. 10 caracteres)"),
    phone: z.string().optional(),
    branches: z.array(z.object({
        name: z.string().min(1, "El nombre de la sucursal es requerido"),
        address: z.string().optional(),
    })).min(1, "Debe agregar al menos una sucursal"),
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
            branches: [{ name: "Sede Principal", address: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "branches",
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4 max-h-[85vh] overflow-y-auto px-2 custom-scrollbar">
            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            <section className="space-y-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Datos de la Empresa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre de la Empresa</Label>
                        <Input id="name" {...form.register("name")} placeholder="Inversiones C.A." />
                        {form.formState.errors.name && (
                            <p className="text-xs text-red-500 font-medium">{form.formState.errors.name.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="rif">RIF (ID Fiscal)</Label>
                        <Input id="rif" {...form.register("rif")} placeholder="J-12345678-9" />
                        {form.formState.errors.rif && (
                            <p className="text-xs text-red-500 font-medium">{form.formState.errors.rif.message}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="address">Dirección Fiscal Completa</Label>
                    <Input id="address" {...form.register("address")} placeholder="Av, Calle, Edif..." />
                    {form.formState.errors.address && (
                        <p className="text-xs text-red-500 font-medium">{form.formState.errors.address.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono de Contacto (Opcional)</Label>
                    <Input id="phone" {...form.register("phone")} placeholder="0212-1234567" />
                </div>
            </section>

            <section className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Sucursales</h3>
                        <p className="text-xs text-slate-400">Debe existir al menos una para facturar.</p>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="rounded-full h-8 w-8 bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                        onClick={() => append({ name: "", address: "" })}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                {fields.map((field, index) => (
                    <div key={field.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 relative group animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex justify-between items-start gap-3">
                            <div className="flex-1 space-y-2">
                                <Label className="text-xs text-slate-600">Nombre de Sucursal #{index + 1}</Label>
                                <Input
                                    {...form.register(`branches.${index}.name`)}
                                    placeholder="Ej. Sucursal Este"
                                    className="bg-white"
                                />
                                {form.formState.errors.branches?.[index]?.name && (
                                    <p className="text-[10px] text-red-500 font-medium">{form.formState.errors.branches[index].name?.message}</p>
                                )}
                            </div>
                            {fields.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 mt-6"
                                    onClick={() => remove(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-600">Dirección de la Sucursal</Label>
                            <Input
                                {...form.register(`branches.${index}.address`)}
                                placeholder="Opcional"
                                className="bg-white"
                            />
                        </div>
                    </div>
                ))}

                {form.formState.errors.branches?.root && (
                    <p className="text-xs text-red-500 text-center font-medium bg-red-50 p-2 rounded-md">
                        {form.formState.errors.branches.root.message}
                    </p>
                )}
            </section>

            <Button type="submit" className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]" disabled={isLoading}>
                {isLoading ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Configurando Empresa...</span>
                    </div>
                ) : (
                    "Finalizar y Crear Empresa"
                )}
            </Button>
        </form>
    );
}

