"use server";

import { assertCompanyAccess } from "@/modules/companies/access";
import { SalesRepository } from "./repository";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const invoiceSchema = z.object({
    customerId: z.string().optional(),
    customerName: z.string().min(1, "El nombre del cliente es requerido"),
    customerRif: z.string().min(5, "El RIF debe ser válido"),
    customerAddress: z.string().optional(),
    branchId: z.string().optional(),
    items: z.array(z.object({
        productId: z.string().optional(),
        sku: z.string(),
        name: z.string(),
        quantity: z.number().min(1),
        price: z.number().min(0),
        taxRate: z.number().default(16),
        isExempt: z.boolean().default(false),
        total: z.number()
    })).min(1, "Debe agregar al menos un ítem"),
    baseAmount: z.number(),
    taxAmount: z.number(),
    igtfAmount: z.number().default(0),
    totalAmount: z.number()
});

export async function createInvoiceAction(companyId: string, data: any) {
    try {
        await assertCompanyAccess(companyId);
    } catch {
        return { error: "No autorizado" };
    }

    const validatedFields = invoiceSchema.safeParse(data);

    if (!validatedFields.success) {
        console.error("Validation error:", validatedFields.error.flatten());
        return { error: "Datos inválidos. Por favor revisa la factura." };
    }

    try {
        // 1. Ensure customer exists or update
        const customer = await SalesRepository.upsertCustomer(companyId, {
            name: validatedFields.data.customerName,
            rif: validatedFields.data.customerRif,
            address: validatedFields.data.customerAddress
        });

        // 2. Create invoice
        const invoice = await SalesRepository.createInvoice(companyId, {
            ...validatedFields.data,
            customerId: customer.id
        });

        revalidatePath(`/dashboard/${companyId}/sales/invoices`);
        return { success: true, invoiceId: invoice.id };

    } catch (error) {
        console.error("Error creating invoice:", error);
        return { error: "Error al generar la factura fiscal." };
    }
}
