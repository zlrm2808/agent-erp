import { getTenantDb } from "./src/lib/tenant-db";

const ID = "cmle98j5q0002tqlbw4ns9os9";

async function test(id: string) {
    try {
        console.log(`Connecting to ${id}...`);
        const tenantDb = await getTenantDb(id);
        const branches = await tenantDb.branch.findMany({ where: { isActive: true } });
        console.log("Found branches:", branches.length);
        console.log("Success:", branches.map(b => b.name));
    } catch (e: any) {
        console.error("Test error:", e.message);
    }
}

test(ID);
