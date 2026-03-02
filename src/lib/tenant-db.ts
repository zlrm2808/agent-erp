import { PrismaClient as TenantPrismaClient } from "../../node_modules/@prisma/client/tenant/index.js";
import { db } from "./orm";

/**
 * Global cache for tenant-specific Prisma clients to avoid too many connections.
 * Uses a basic LRU (Least Recently Used) strategy to close old connections.
 */
const MAX_CLIENTS = 50;
const tenantClients = new Map<string, TenantPrismaClient>();

/**
 * Gets a Prisma client for a specific company's private database.
 */
export async function getTenantDb(companyId: string) {
    // 1. Return from cache if exists
    if (tenantClients.has(companyId)) {
        // Move to the end of the Map (most recently used)
        const client = tenantClients.get(companyId)!;
        tenantClients.delete(companyId);
        tenantClients.set(companyId, client);
        return client;
    }

    // 2. Find company to get its databaseUrl
    const company = await db.company.findUnique({
        where: { id: companyId },
        select: { databaseUrl: true },
    });

    if (!company) {
        throw new Error(`Company with ID ${companyId} not found.`);
    }

    // 3. Manage cache size (LRU)
    if (tenantClients.size >= MAX_CLIENTS) {
        const oldestCompanyId = tenantClients.keys().next().value;
        if (oldestCompanyId) {
            console.log(`[TenantDB] Closing oldest connection for: ${oldestCompanyId}`);
            const oldestClient = tenantClients.get(oldestCompanyId);
            await oldestClient?.$disconnect();
            tenantClients.delete(oldestCompanyId);
        }
    }

    // 4. Construct and cache new client
    console.log(`[TenantDB] Initializing new client for: ${companyId}`);
    const client = new TenantPrismaClient({
        datasources: {
            db: {
                url: company.databaseUrl,
            },
        },
    });

    tenantClients.set(companyId, client);

    return client;
}

