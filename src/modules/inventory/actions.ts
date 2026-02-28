"use server";

import { assertCompanyAccess } from "@/modules/companies/access";
import { InventoryRepository } from "./repository";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const productSchema = z.object({
    sku: z.string().min(1, "El SKU es requerido"),
    name: z.string().min(1, "El nombre es requerido"),
    description: z.string().optional(),
    costPrice: z.coerce.number().min(0, "El precio de costo debe ser mayor o igual a 0"),
    salePrice: z.coerce.number().min(0, "El precio de venta debe ser mayor o igual a 0"),
    stock: z.coerce.number().int().min(0, "El stock inicial debe ser mayor o igual a 0"),
    minStock: z.coerce.number().int().min(0, "El stock mínimo debe ser mayor o igual a 0"),
    categoryId: z.string().optional(),
});

export async function createProductAction(companyId: string, formData: FormData) {
    try {
        await assertCompanyAccess(companyId);
    } catch {
        return { error: "No autorizado" };
    }

    const rawData = {
        sku: formData.get("sku"),
        name: formData.get("name"),
        description: formData.get("description"),
        costPrice: formData.get("costPrice"),
        salePrice: formData.get("salePrice"),
        stock: formData.get("stock"),
        minStock: formData.get("minStock"),
        categoryId: formData.get("categoryId"),
    };

    const validatedFields = productSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: "Datos inválidos. Por favor revisa el formulario." };
    }

    try {
        await InventoryRepository.createProduct(companyId, validatedFields.data);
    } catch (error) {
        console.error("Error creating product:", error);
        return { error: "Error al crear el producto. Es posible que el SKU ya exista." };
    }

    revalidatePath(`/dashboard/${companyId}/inventory/products`);
    redirect(`/dashboard/${companyId}/inventory/products`);
}

export async function updateProductAction(companyId: string, productId: string, formData: FormData) {
    try {
        await assertCompanyAccess(companyId);
    } catch {
        return { error: "No autorizado" };
    }

    const rawData = {
        sku: formData.get("sku"),
        name: formData.get("name"),
        description: formData.get("description"),
        costPrice: formData.get("costPrice"),
        salePrice: formData.get("salePrice"),
        stock: formData.get("stock"),
        minStock: formData.get("minStock"),
        categoryId: formData.get("categoryId"),
    };

    const validatedFields = productSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: "Datos inválidos. Por favor revisa el formulario." };
    }

    try {
        // Need to add updateProduct to repository
        await InventoryRepository.updateProduct(companyId, productId, validatedFields.data);
    } catch (error) {
        console.error("Error updating product:", error);
        return { error: "Error al actualizar el producto." };
    }

    revalidatePath(`/dashboard/${companyId}/inventory/products`);
    redirect(`/dashboard/${companyId}/inventory/products`);
}

const movementSchema = z.object({
    productId: z.string().min(1, "El producto es requerido"),
    type: z.enum(["IN", "OUT", "ADJUSTMENT"], { required_error: "El tipo es requerido" }),
    quantity: z.coerce.number().int().min(1, "La cantidad debe ser mayor a 0"),
    reference: z.string().optional(),
    notes: z.string().optional(),
});

export async function recordMovementAction(companyId: string, formData: FormData) {
    let user;
    try {
        user = await assertCompanyAccess(companyId);
    } catch {
        return { error: "No autorizado" };
    }

    const rawData = {
        productId: formData.get("productId"),
        type: formData.get("type"),
        quantity: formData.get("quantity"),
        reference: formData.get("reference"),
        notes: formData.get("notes"),
    };

    const validatedFields = movementSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: "Datos inválidos. Por favor revisa el formulario." };
    }

    try {
        await InventoryRepository.recordMovement({
            companyId,
            userId: user.id,
            ...validatedFields.data,
        });
    } catch (error) {
        console.error("Error recording movement:", error);
        return { error: "Error al registrar el movimiento." };
    }

    revalidatePath(`/dashboard/${companyId}/inventory`);
    revalidatePath(`/dashboard/${companyId}/inventory/products`);
    redirect(`/dashboard/${companyId}/inventory`);
}
