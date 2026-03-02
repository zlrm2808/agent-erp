import { getTenantDb } from "./src/lib/tenant-db";

const ID = "cmle98j5q0002tqlbw4ns9os9";

async function check() {
    try {
        const tenantDb = await getTenantDb(ID);
        const count = await tenantDb.branch.count();
        console.log("Branch count:", count);
        if (count === 0) {
            console.log("Creating default branch...");
            await tenantDb.branch.create({
                data: {
                    name: "Sede Principal",
                    address: "Dirección Principal",
                    isActive: true
                }
            });
            console.log("Branch created.");
        }
    } catch (e: any) {
        console.error("Error:", e.message);
    }
}

check();
