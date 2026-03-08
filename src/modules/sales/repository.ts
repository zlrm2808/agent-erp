import { getTenantDb } from "@/lib/tenant-db";

export const SalesRepository = {
    /**
     * Gets the current fiscal configuration for the company
     */
    async getFiscalSettings(companyId: string) {
        const tenantDb = await getTenantDb(companyId);
        return tenantDb.fiscalSetting.findUnique({
            where: { id: "global-settings" },
            include: { digitalPrinter: true }
        });
    },

    /**
     * Finds customers by name or RIF
     */
    async searchCustomers(companyId: string, query: string) {
        const tenantDb = await getTenantDb(companyId);
        return tenantDb.customer.findMany({
            where: {
                OR: [
                    { name: { contains: query } },
                    { rif: { contains: query } }
                ],
                isActive: true
            },
            take: 10
        });
    },

    /**
     * Creates or updates a customer
     */
    async upsertCustomer(companyId: string, data: { name: string; rif: string; address?: string }) {
        const tenantDb = await getTenantDb(companyId);
        return tenantDb.customer.upsert({
            where: { rif: data.rif },
            update: { name: data.name, address: data.address },
            create: { name: data.name, rif: data.rif, address: data.address }
        });
    },

    /**
     * Creates an invoice with fiscal numbering compliance (Art 7)
     */
    async createInvoice(companyId: string, data: any) {
        const tenantDb = await getTenantDb(companyId);

        // 1. Get fiscal settings to obtain next numbers
        const settings = await tenantDb.fiscalSetting.upsert({
            where: { id: "global-settings" },
            update: {},
            create: {
                taxRate: 16.0,
                currentInvoiceSeq: 1,
                currentControlSeq: 1
            },
            include: { digitalPrinter: true }
        });

        const invoiceSeq = settings.currentInvoiceSeq;
        const controlSeq = settings.currentControlSeq;

        // Format according to Art 7.4 (Control number unique and consecutive)
        const invoiceNumber = invoiceSeq.toString().padStart(8, '0');
        const controlNumber = `00-${controlSeq.toString().padStart(8, '0')}`;

        // 2. Perform transaction to save invoice and update sequences
        return tenantDb.$transaction(async (tx) => {
            const invoice = await tx.invoice.create({
                data: {
                    type: "FACTURA",
                    invoiceNumber,
                    controlNumber,
                    branchId: data.branchId,
                    customerId: data.customerId,
                    customerName: data.customerName,
                    customerRif: data.customerRif,
                    customerAddress: data.customerAddress,
                    baseAmount: data.baseAmount,
                    taxAmount: data.taxAmount,
                    igtfAmount: data.igtfAmount || 0,
                    totalAmount: data.totalAmount,
                    printerRif: settings.digitalPrinter?.rif,
                    printerAuth: settings.digitalPrinter?.authNumber,
                    printerAuthDate: settings.digitalPrinter?.authDate,
                    items: {
                        create: data.items.map((item: any) => ({
                            sku: item.sku,
                            description: item.name,
                            quantity: item.quantity,
                            price: item.price,
                            isExempt: item.isExempt || false,
                            taxRate: item.taxRate || settings.taxRate,
                            total: item.total
                        }))
                    }
                }
            });

            // Update sequences for next invoice
            await tx.fiscalSetting.update({
                where: { id: "global-settings" },
                data: {
                    currentInvoiceSeq: { increment: 1 },
                    currentControlSeq: { increment: 1 }
                }
            });

            // Update product stock (Art 7.9 requires product data)
            for (const item of data.items) {
                if (item.productId) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: { stock: { decrement: item.quantity } }
                    });

                    await tx.inventoryMovement.create({
                        data: {
                            productId: item.productId,
                            type: "OUT",
                            quantity: item.quantity,
                            reference: `Factura #${invoiceNumber}`,
                            notes: `Venta a ${data.customerName}`
                        }
                    });
                }
            }

            return invoice;
        });
    },

    /**
     * Gets recent invoices
     */
    async getInvoices(companyId: string, limit = 20) {
        const tenantDb = await getTenantDb(companyId);
        return tenantDb.invoice.findMany({
            orderBy: { date: 'desc' },
            take: limit,
            include: { items: true }
        });
    }
};
