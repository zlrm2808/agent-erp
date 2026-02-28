"use server";

import { getCurrentUser } from "@/modules/auth/session";
import { CompanyRepository } from "./repository";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { bootstrapTenantDatabase } from "./tenant-bootstrap";

export async function createCompanyAction(formData: {
    name: string;
    rif: string;
    address: string;
    phone?: string;
    branchName: string;
}) {
    const user = await getCurrentUser();

    if (!user) {
        return { error: "No autorizado. Inicia sesión de nuevo." };
    }

    try {
        const tenantSlug = formData.rif.toLowerCase().replace(/[^a-z0-9]/g, "");
        const dbName = `tenant_${tenantSlug}.db`;
        const databaseUrl = `file:./${dbName}`;

        bootstrapTenantDatabase(databaseUrl);

        await CompanyRepository.create(
            {
                name: formData.name,
                rif: formData.rif,
                address: formData.address,
                phone: formData.phone,
                databaseUrl,
                branchName: formData.branchName,
            },
            user.id,
        );

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
    } catch {
        return { error: "Error al obtener las empresas." };
    }
}

export async function selectCompanyAction(companyId: string) {
    redirect(`/dashboard/${companyId}/overview`);
}
