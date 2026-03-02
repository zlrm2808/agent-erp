import { getTenantDb } from "@/lib/tenant-db";

export const SyncRepository = {
    /**
     * Synchronizes a batch of invoices created offline.
     * Ensures that each invoice gets a proper sequential number (correlativo)
     * based on the order they were created offline.
     */
    async syncInvoices(companyId: string, offlineInvoices: any[]) {
        const tenantDb = await getTenantDb(companyId);

        return tenantDb.$transaction(async (tx: any) => {
            const results = [];

            // Sort by offline creation date to maintain chronological order
            const sortedInvoices = [...offlineInvoices].sort(
                (a, b) => new Date(a.offlineCreatedAt).getTime() - new Date(b.offlineCreatedAt).getTime()
            );

            for (const invoiceData of sortedInvoices) {
                // 1. Check if already synced
                const existing = await tx.invoice.findUnique({
                    where: { localId: invoiceData.localId },
                    select: { id: true, invoiceNumber: true }
                });

                if (existing) {
                    results.push({ localId: invoiceData.localId, status: "already_synced", invoiceNumber: existing.invoiceNumber });
                    continue;
                }

                // 2. Get current sequence for the branch/fiscal setting
                // We increment the global sequence to ensure the "correlativo" is correct
                const fiscalSettings = await tx.fiscalSetting.findFirst({
                    where: { id: "global-settings" }
                });

                if (!fiscalSettings) {
                    throw new Error("FISCAL_SETTINGS_NOT_FOUND");
                }

                const nextNumber = fiscalSettings.invoiceNumberSeq;
                const formattedNumber = `FAC-${nextNumber.toString().padStart(8, '0')}`;

                // For Control Number (Venezuela specific requirement often mentioned by user)
                const nextControl = fiscalSettings.controlNumberSeq;
                const formattedControl = `00-${nextControl.toString().padStart(8, '0')}`;

                // 3. Create the real invoice record
                const newInvoice = await tx.invoice.create({
                    data: {
                        localId: invoiceData.localId,
                        invoiceNumber: formattedNumber,
                        controlNumber: formattedControl,
                        date: new Date(invoiceData.offlineCreatedAt),
                        customerName: invoiceData.customerName,
                        customerRif: invoiceData.customerRif,
                        customerAddress: invoiceData.customerAddress,
                        branchId: invoiceData.branchId,
                        terminalId: invoiceData.terminalId,
                        currencyId: invoiceData.currencyId,
                        exchangeRate: invoiceData.exchangeRate,
                        baseAmount: invoiceData.baseAmount,
                        taxAmount: invoiceData.taxAmount,
                        totalAmount: invoiceData.totalAmount,
                        status: "issued",
                        isOffline: true,
                        isSynced: true,
                        offlineCreatedAt: new Date(invoiceData.offlineCreatedAt),
                        items: {
                            create: invoiceData.items.map((item: any) => ({
                                productId: item.productId,
                                productName: item.productName,
                                quantity: item.quantity,
                                unitPrice: item.unitPrice,
                                taxRate: item.taxRate,
                                total: item.total
                            }))
                        }
                    }
                });

                // 4. Update the sequence in fiscal settings
                await tx.fiscalSetting.update({
                    where: { id: fiscalSettings.id },
                    data: {
                        invoiceNumberSeq: { increment: 1 },
                        controlNumberSeq: { increment: 1 }
                    }
                });

                results.push({
                    localId: invoiceData.localId,
                    id: newInvoice.id,
                    invoiceNumber: formattedNumber,
                    status: "synced"
                });
            }

            return results;
        });
    },

    /**
     * Synchronizes a batch of inventory movements created offline.
     */
    async syncMovements(companyId: string, userId: string, offlineMovements: any[]) {
        const tenantDb = await getTenantDb(companyId);

        return tenantDb.$transaction(async (tx: any) => {
            const results = [];

            for (const movement of offlineMovements) {
                // 1. Check if already synced
                const existing = await tx.inventoryMovement.findUnique({
                    where: { localId: movement.localId },
                    select: { id: true }
                });

                if (existing) {
                    results.push({ localId: movement.localId, status: "already_synced" });
                    continue;
                }

                // 2. Perform the stock change
                const stockChange = movement.type === "OUT" ? -movement.quantity : movement.quantity;

                await tx.product.update({
                    where: { id: movement.productId },
                    data: {
                        stock: { increment: stockChange },
                    },
                });

                // 3. Create the record
                const newRecord = await tx.inventoryMovement.create({
                    data: {
                        localId: movement.localId,
                        productId: movement.productId,
                        type: movement.type,
                        quantity: movement.quantity,
                        reference: movement.reference,
                        notes: movement.notes,
                        userId,
                        isOffline: true,
                        isSynced: true,
                        createdAt: new Date(movement.offlineCreatedAt)
                    }
                });

                results.push({ localId: movement.localId, id: newRecord.id, status: "synced" });
            }

            return results;
        });
    }
};

