import { getTenantDb } from "@/lib/tenant-db";

export const OrganizationRepository = {
    // Branch methods
    async getBranches(companyId: string) {
        const tenantDb = await getTenantDb(companyId);
        return tenantDb.branch.findMany({
            where: { isActive: true },
            orderBy: { name: "asc" },
        });
    },

    async createBranch(companyId: string, data: { name: string; address?: string; phone?: string }) {
        const tenantDb = await getTenantDb(companyId);
        return tenantDb.branch.create({
            data,
        });
    },

    // Business Unit methods
    async getBusinessUnits(companyId: string, branchId?: string) {
        const tenantDb = await getTenantDb(companyId);
        return tenantDb.businessUnit.findMany({
            where: {
                isActive: true,
                branchId: branchId || undefined,
            },
            include: { branch: true },
            orderBy: { name: "asc" },
        });
    },

    async createBusinessUnit(companyId: string, data: { branchId: string; name: string; description?: string }) {
        const tenantDb = await getTenantDb(companyId);
        return tenantDb.businessUnit.create({
            data,
        });
    },
};
