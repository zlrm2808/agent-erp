"use server";

import { assertCompanyAccess } from "@/modules/companies/access";
import { SyncRepository } from "./repository";
import { revalidatePath } from "next/cache";

/**
 * Server action to synchronize offline invoices.
 * Expects a companyId and a list of offline invoice objects.
 */
export async function syncOfflineInvoicesAction(companyId: string, offlineInvoices: any[]) {
    try {
        await assertCompanyAccess(companyId);
    } catch {
        return { error: "No autorizado" };
    }

    if (!offlineInvoices || offlineInvoices.length === 0) {
        return { success: true, results: [] };
    }

    try {
        const results = await SyncRepository.syncInvoices(companyId, offlineInvoices);

        revalidatePath(`/dashboard/${companyId}/invoices`);
        return { success: true, results };
    } catch (error) {
        console.error("Error syncing offline invoices:", error);
        return { error: "Error al sincronizar las facturas offline." };
    }
}

/**
 * Server action to synchronize offline inventory movements.
 */
export async function syncOfflineMovementsAction(companyId: string, offlineMovements: any[]) {
    let user;
    try {
        user = await assertCompanyAccess(companyId);
    } catch {
        return { error: "No autorizado" };
    }

    if (!offlineMovements || offlineMovements.length === 0) {
        return { success: true, results: [] };
    }

    try {
        const results = await SyncRepository.syncMovements(companyId, user.id, offlineMovements);

        revalidatePath(`/dashboard/${companyId}/inventory`);
        return { success: true, results };
    } catch (error) {
        console.error("Error syncing offline movements:", error);
        return { error: "Error al sincronizar los movimientos de inventario offline." };
    }
}

