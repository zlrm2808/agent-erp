import { getTenantDb } from "./src/lib/tenant-db";

async function test() {
    try {
        console.log("Testing getTenantDb...");
        // This will likely fail with "Company not found" but we want to see if it even runs
        const db = await getTenantDb("dummy-id");
        console.log("Result:", !!db);
    } catch (e) {
        console.error("Test error:", e.message);
    }
}

test();
