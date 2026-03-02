import { exec } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs";
import path from "node:path";

import { getTenantDb } from "@/lib/tenant-db";

const execAsync = promisify(exec);

export async function bootstrapTenantDatabase(databaseUrl: string) {
    const dbPath = path.join(process.cwd(), "prisma", databaseUrl.replace("file:./", ""));

    console.log(`[TenantBootstrap] Bootstrapping database at: ${dbPath}`);

    if (!fs.existsSync(dbPath)) {
        console.log(`[TenantBootstrap] Creating empty database file.`);
        fs.writeFileSync(dbPath, "");
    }

    const command = process.platform === "win32" ? "npx.cmd" : "npx";
    const args = `-y prisma db push --schema prisma/tenant.prisma --skip-generate`;

    try {
        console.log(`[TenantBootstrap] Running: ${command} ${args}`);
        const { stdout, stderr } = await execAsync(`${command} ${args}`, {
            cwd: process.cwd(),
            env: {
                ...process.env,
                TENANT_DATABASE_URL: databaseUrl,
            },
        });
        console.log(`[TenantBootstrap] Success:`, stdout);
        if (stderr) console.warn(`[TenantBootstrap] Stderr:`, stderr);
    } catch (error: any) {
        console.error(`[TenantBootstrap] ERROR during db push:`, error.message);
        if (error.stdout) console.log(`[TenantBootstrap] Stdout:`, error.stdout);
        if (error.stderr) console.error(`[TenantBootstrap] Stderr:`, error.stderr);
        throw new Error(`Error al inicializar la base de datos: ${error.message}`);
    }
}

/**
 * Seeds the tenant database with initial default data
 */
export async function seedTenantDatabase(companyId: string, customBranches?: { name: string; address?: string }[]) {
    const tenantDb = await getTenantDb(companyId);

    // 1. Create Branches
    const branchesToCreate = customBranches && customBranches.length > 0
        ? customBranches
        : [{ name: "Sede Principal", address: "" }];

    const createdBranches = [];
    for (const b of branchesToCreate) {
        const branch = await tenantDb.branch.create({
            data: {
                name: b.name,
                address: b.address,
                isActive: true,
            },
        });
        createdBranches.push(branch);
    }


    // 2. Create Base Currencies
    const ves = await tenantDb.currency.upsert({
        where: { code: "VES" },
        update: {},
        create: {
            code: "VES",
            name: "Bolívar Soberano",
            symbol: "Bs.",
            isBase: true,
        },
    });

    const usd = await tenantDb.currency.upsert({
        where: { code: "USD" },
        update: {},
        create: {
            code: "USD",
            name: "Dólar Estadounidense",
            symbol: "$",
            isBase: false,
        },
    });

    // 3. Set Base Currency and Reset Fiscal sequences
    await tenantDb.fiscalSetting.upsert({
        where: { id: "global-settings" },
        update: {
            baseCurrencyId: ves.id,
            invoiceNumberSeq: 1, // Reset sequences if needed, or keep previous
            controlNumberSeq: 1
        },
        create: {
            id: "global-settings",
            baseCurrencyId: ves.id,
            invoiceNumberSeq: 1,
            controlNumberSeq: 1
        },
    });


    // 4. Create Basic Accounting Groups
    const accountingGroups = [
        { code: "1", name: "Activos", type: "Asset" },
        { code: "2", name: "Pasivos", type: "Liability" },
        { code: "3", name: "Patrimonio", type: "Equity" },
        { code: "4", name: "Ingresos", type: "Revenue" },
        { code: "5", name: "Gastos", type: "Expense" },
    ];

    for (const group of accountingGroups) {
        await tenantDb.accountingGroup.upsert({
            where: { code: group.code },
            update: {},
            create: group,
        });
    }

    return { createdBranches, ves, usd };
}

