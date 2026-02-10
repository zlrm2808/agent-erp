"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { recordMovementAction } from "@/modules/inventory/actions";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";

const movementSchema = z.object({
    productId: z.string().min(1, "El producto es requerido"),
    type: z.enum(["IN", "OUT", "ADJUSTMENT"], { required_error: "El tipo es requerido" }),
    quantity: z.coerce.number().int().min(1, "La cantidad debe ser mayor a 0"),
    reference: z.string().optional(),
    notes: z.string().optional(),
});

type MovementFormValues = z.infer<typeof movementSchema>;

interface MovementFormProps {
    companyId: string;
    products: { id: string; name: string; sku: string }[];
    initialType?: "IN" | "OUT" | "ADJUSTMENT";
}

export function MovementForm({ companyId, products, initialType }: MovementFormProps) {
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const form = useForm<MovementFormValues>({
        resolver: zodResolver(movementSchema),
        defaultValues: {
            productId: "",
            type: initialType || "IN",
            quantity: 1,
            reference: "",
            notes: "",
        },
    });

    function onSubmit(values: MovementFormValues) {
        setError(null);
        startTransition(async () => {
            const formData = new FormData();
            formData.append("productId", values.productId);
            formData.append("type", values.type);
            formData.append("quantity", values.quantity.toString());
            if (values.reference) formData.append("reference", values.reference);
            if (values.notes) formData.append("notes", values.notes);

            const result = await recordMovementAction(companyId, formData);

            if (result?.error) {
                setError(result.error);
            }
        });
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
            {error && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="productId">Producto</Label>
                <Select
                    value={form.watch("productId")}
                    onValueChange={(value) => form.setValue("productId", value)}
                >
                    <SelectTrigger id="productId">
                        <SelectValue placeholder="Selecciona un producto" />
                    </SelectTrigger>
                    <SelectContent>
                        {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                                {product.sku} - {product.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {form.formState.errors.productId && (
                    <p className="text-destructive text-xs">{form.formState.errors.productId.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="type">Tipo de Movimiento</Label>
                <Select
                    value={form.watch("type")}
                    onValueChange={(value) => form.setValue("type", value as "IN" | "OUT" | "ADJUSTMENT")}
                >
                    <SelectTrigger id="type">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="IN">Entrada (IN)</SelectItem>
                        <SelectItem value="OUT">Salida (OUT)</SelectItem>
                        <SelectItem value="ADJUSTMENT">Ajuste (ADJUSTMENT)</SelectItem>
                    </SelectContent>
                </Select>
                {form.formState.errors.type && (
                    <p className="text-destructive text-xs">{form.formState.errors.type.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="quantity">Cantidad</Label>
                <Input
                    id="quantity"
                    type="number"
                    min="1"
                    step="1"
                    {...form.register("quantity")}
                />
                {form.formState.errors.quantity && (
                    <p className="text-destructive text-xs">{form.formState.errors.quantity.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="reference">Referencia (Opcional)</Label>
                <Input
                    id="reference"
                    placeholder="Ej: Orden de Compra #123"
                    {...form.register("reference")}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes">Notas (Opcional)</Label>
                <Textarea
                    id="notes"
                    placeholder="Información adicional sobre el movimiento..."
                    {...form.register("notes")}
                />
            </div>

            <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Registrar Movimiento
            </Button>
        </form>
    );
}
