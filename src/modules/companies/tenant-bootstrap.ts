import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export function bootstrapTenantDatabase(databaseUrl: string) {
    const dbPath = path.join(process.cwd(), "prisma", databaseUrl.replace("file:./", ""));

    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, "");
    }

    execFileSync(
        process.platform === "win32" ? "bunx.cmd" : "bunx",
        ["prisma", "db", "push", "--schema", "prisma/tenant.prisma", "--skip-generate"],
        {
            cwd: process.cwd(),
            env: {
                ...process.env,
                TENANT_DATABASE_URL: databaseUrl,
            },
            stdio: "pipe",
        },
    );
}
