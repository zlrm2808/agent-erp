"use server";

import { assertCompanyAccess } from "@/modules/companies/access";
import { PayrollRepository } from "./repository";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// --- Employee Schema ---
const employeeSchema = z.object({
    firstName: z.string().min(1, "Nombre es requerido"),
    lastName: z.string().min(1, "Apellido es requerido"),
    idNumber: z.string().min(1, "Cédula es requerida"),
    nationality: z.string().default("V"),
    hireDate: z.string().or(z.date()),
    baseSalary: z.coerce.number().min(0),
    position: z.string().optional(),
    department: z.string().optional(),
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
});

export async function createEmployeeAction(companyId: string, data: any) {
    try {
        await assertCompanyAccess(companyId);
        const tenantDb = await (require("@/lib/tenant-db").getTenantDb(companyId));

        const validated = employeeSchema.parse(data);

        await tenantDb.employee.create({
            data: {
                ...validated,
                hireDate: new Date(validated.hireDate),
                bankName: data.bankName || null,
                accountNumber: data.accountNumber || null,
            }
        });

        revalidatePath(`/dashboard/${companyId}/payroll/employees`);
        return { success: true };
    } catch (e: any) {
        return { error: e.message };
    }
}

// --- Payroll Generation ---
export async function generatePayrollAction(companyId: string, data: { type: string; startDate: string; endDate: string }) {
    try {
        await assertCompanyAccess(companyId);

        await PayrollRepository.generatePayroll(companyId, {
            type: data.type,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate)
        });

        revalidatePath(`/dashboard/${companyId}/payroll`);
        return { success: true };
    } catch (e: any) {
        console.error("Payroll Error:", e);
        return { error: e.message };
    }
}

// --- Parameter Updates ---
export async function updatePayrollParamsAction(companyId: string, data: any) {
    try {
        await assertCompanyAccess(companyId);
        const tenantDb = await (require("@/lib/tenant-db").getTenantDb(companyId));

        await tenantDb.payrollParameter.update({
            where: { id: "payroll-params" },
            data: {
                minWage: parseFloat(data.minWage),
                mealTicket: parseFloat(data.mealTicket),
                ivssRate: parseFloat(data.ivssRate),
                faovRate: parseFloat(data.faovRate),
                lpeRate: parseFloat(data.lpeRate),
            }
        });

        revalidatePath(`/dashboard/${companyId}/payroll/settings`);
        return { success: true };
    } catch (e: any) {
        return { error: e.message };
    }
}

// --- Reporting and Exports ---
export async function getPayrollHistoryAction(companyId: string) {
    try {
        await assertCompanyAccess(companyId);
        return await PayrollRepository.getPayrollHistory(companyId);
    } catch (e: any) {
        console.error("History Error:", e);
        return [];
    }
}

export async function getBankFileAction(companyId: string, payrollId: string, bank: "BANESCO" | "BBVA") {
    try {
        await assertCompanyAccess(companyId);
        const content = await PayrollRepository.generateBankFile(companyId, payrollId, bank);
        return { success: true, content };
    } catch (e: any) {
        return { error: e.message };
    }
}

export async function getEmployerReportAction(companyId: string, payrollId: string) {
    try {
        await assertCompanyAccess(companyId);
        const report = await PayrollRepository.getEmployerReports(companyId, payrollId);
        return { success: true, report };
    } catch (e: any) {
        return { error: e.message };
    }
}
