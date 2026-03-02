import { getTenantDb } from "@/lib/tenant-db";

export const FinanceRepository = {
    // Currency methods
    async getCurrencies(companyId: string) {
        const tenantDb = await getTenantDb(companyId);
        return tenantDb.currency.findMany({
            where: { isActive: true },
            include: { exchangeRates: { orderBy: { effectiveAt: "desc" }, take: 1 } },
            orderBy: { name: "asc" },
        });
    },

    async createCurrency(companyId: string, data: { code: string; name: string; symbol: string; isBase?: boolean }) {
        const tenantDb = await getTenantDb(companyId);
        return tenantDb.currency.create({
            data,
        });
    },

    async updateExchangeRate(companyId: string, currencyId: string, rate: number) {
        const tenantDb = await getTenantDb(companyId);
        return tenantDb.exchangeRate.create({
            data: {
                currencyId,
                rate,
                effectiveAt: new Date(),
            },
        });
    },

    // Accounting Group methods
    async getAccountingGroups(companyId: string) {
        const tenantDb = await getTenantDb(companyId);
        return tenantDb.accountingGroup.findMany({
            where: { isActive: true },
            orderBy: { code: "asc" },
        });
    },

    async createAccountingGroup(companyId: string, data: { code: string; name: string; description?: string; type: string }) {
        const tenantDb = await getTenantDb(companyId);
        return tenantDb.accountingGroup.create({
            data,
        });
    },
};
