"use server";

import { getCurrentUser } from "@/modules/auth/session";
import { CompanyRepository } from "./repository";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import fs from "fs";
import path from "path";

export async function createCompanyAction(formData: { name: string; rif: string; address: string; phone?: string }) {
    const user = await getCurrentUser();

    if (!user) {
        return { error: "No autorizado. Inicia sesión de nuevo." };
    }

    try {
        const tenantSlug = formData.rif.toLowerCase().replace(/[^a-z0-9]/g, '');
        const dbName = `tenant_${tenantSlug}.db`;
        const databaseUrl = `file:./${dbName}`;

        // 1. Create the physical database file if it doesn't exist
        const dbPath = path.join(process.cwd(), "prisma", dbName);
        if (!fs.existsSync(dbPath)) {
            // We copy the demo database or just create an empty file.
            // In a more advanced version, we would run 'prisma db push' programmatically here.
            fs.writeFileSync(dbPath, "");
        }

        await CompanyRepository.create({
            name: formData.name,
            rif: formData.rif,
            address: formData.address,
            phone: formData.phone,
            databaseUrl,
        }, user.id);

        revalidatePath("/dashboard/companies");
        return { success: true };
    } catch (err) {
        console.error("Error creating company:", err);
        return { error: "No se pudo crear la empresa. Verifica que el RIF no esté duplicado." };
    }
}

export async function getCompaniesAction() {
    const user = await getCurrentUser();

    if (!user) {
        return { error: "No autorizado." };
    }

    try {
        const companies = await CompanyRepository.findByUserId(user.id);
        return { success: true, companies };
    } catch (err) {
        return { error: "Error al obtener las empresas." };
    }
}

export async function selectCompanyAction(companyId: string) {
    redirect(`/dashboard/${companyId}/overview`);
}
