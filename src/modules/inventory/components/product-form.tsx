"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createProductAction, updateProductAction } from "@/modules/inventory/actions";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const productSchema = z.object({
    sku: z.string().min(1, "El SKU es requerido"),
    name: z.string().min(1, "El nombre es requerido"),
    description: z.string().optional(),
    costPrice: z.coerce.number().min(0, "Debe ser mayor o igual a 0"),
    salePrice: z.coerce.number().min(0, "Debe ser mayor o igual a 0"),
    stock: z.coerce.number().int().min(0, "Debe ser mayor o igual a 0"),
    minStock: z.coerce.number().int().min(0, "Debe ser mayor o igual a 0"),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
    companyId: string;
    initialData?: {
        id: string;
        sku: string;
        name: string;
        description: string | null;
        costPrice: number;
        salePrice: number;
        stock: number;
        minStock: number;
    } | null;
}

export function ProductForm({ companyId, initialData }: ProductFormProps) {
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: initialData ? {
            sku: initialData.sku,
            name: initialData.name,
            description: initialData.description || "",
            costPrice: initialData.costPrice,
            salePrice: initialData.salePrice,
            stock: initialData.stock,
            minStock: initialData.minStock,
        } : {
            sku: "",
            name: "",
            description: "",
            costPrice: 0,
            salePrice: 0,
            stock: 0,
            minStock: 5,
        },
    });

    function onSubmit(values: ProductFormValues) {
        setError(null);
        startTransition(async () => {
            const formData = new FormData();
            formData.append("sku", values.sku);
            formData.append("name", values.name);
            if (values.description) formData.append("description", values.description);
            formData.append("costPrice", values.costPrice.toString());
            formData.append("salePrice", values.salePrice.toString());
            formData.append("stock", values.stock.toString());
            formData.append("minStock", values.minStock.toString());

            let result;
            if (initialData) {
                result = await updateProductAction(companyId, initialData.id, formData);
            } else {
                result = await createProductAction(companyId, formData);
            }

            if (result?.error) {
                setError(result.error);
            }
        });
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
            {error && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                    {error}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input id="sku" placeholder="A-001" {...form.register("sku")} />
                    {form.formState.errors.sku && <p className="text-destructive text-xs">{form.formState.errors.sku.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input id="name" placeholder="Producto Ejemplo" {...form.register("name")} />
                    {form.formState.errors.name && <p className="text-destructive text-xs">{form.formState.errors.name.message}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" placeholder="Descripción del producto..." {...form.register("description")} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="costPrice">Precio de Costo</Label>
                    <Input id="costPrice" type="number" step="0.01" min="0" {...form.register("costPrice")} />
                    {form.formState.errors.costPrice && <p className="text-destructive text-xs">{form.formState.errors.costPrice.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="salePrice">Precio de Venta</Label>
                    <Input id="salePrice" type="number" step="0.01" min="0" {...form.register("salePrice")} />
                    {form.formState.errors.salePrice && <p className="text-destructive text-xs">{form.formState.errors.salePrice.message}</p>}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="stock">Stock Inicial</Label>
                    <Input id="stock" type="number" min="0" step="1" {...form.register("stock")} />
                    {form.formState.errors.stock && <p className="text-destructive text-xs">{form.formState.errors.stock.message}</p>}
                    <p className="text-xs text-muted-foreground">Esta acción generará un movimiento de entrada inicial.</p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="minStock">Stock Mínimo</Label>
                    <Input id="minStock" type="number" min="0" step="1" {...form.register("minStock")} />
                    {form.formState.errors.minStock && <p className="text-destructive text-xs">{form.formState.errors.minStock.message}</p>}
                </div>
            </div>

            <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {initialData ? "Guardar Cambios" : "Crear Producto"}
            </Button>
        </form>
    )
}
