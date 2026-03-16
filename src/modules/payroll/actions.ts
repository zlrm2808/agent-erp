"use server";

import { assertCompanyAccess } from "@/modules/companies/access";
import { PayrollRepository } from "./repository";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// --- Employee Schema ---
const employeeSchema = z.object({
    employeeCode: z.string().optional(),
    firstName: z.string().min(1, "Nombre es requerido"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Apellido es requerido"),
    secondLastName: z.string().optional(),
    idNumber: z.string().min(1, "Cédula es requerida"),
    nationality: z.string().default("V"),
    rif: z.string().optional(),
    birthDate: z.string().or(z.date()).optional(),
    birthPlace: z.string().optional(),
    birthState: z.string().optional(),
    gender: z.string().optional(),
    maritalStatus: z.string().optional(),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    phone: z.string().optional(),
    address: z.string().optional(),
    address2: z.string().optional(),
    address3: z.string().optional(),
    phone2: z.string().optional(),
    mobilePhone: z.string().optional(),
    pin: z.string().optional(),

    // Job Info
    position: z.string().optional(),
    department: z.string().optional(),
    functionalUnit: z.string().optional(),
    group: z.string().optional(),
    businessUnit: z.string().optional(),
    costCenter: z.string().optional(),
    shift: z.string().optional(),
    employeeCondition: z.string().optional(),
    payrollType: z.string().optional(),
    category: z.string().optional(),
    instructionLevel: z.string().optional(),
    professionalStart: z.string().or(z.date()).optional(),
    hireDate: z.string().or(z.date()),
    terminationDate: z.string().or(z.date()).optional(),
    exitDate: z.string().or(z.date()).optional(),
    exitMotive: z.string().optional(),
    tabulator: z.coerce.number().default(0),
    contractEndDate: z.string().or(z.date()).optional(),
    vacationStartDate: z.string().or(z.date()).optional(),
    vacationEndDate: z.string().or(z.date()).optional(),
    lastSocialBenefitsDeposit: z.string().or(z.date()).optional(),
    baseSalary: z.coerce.number().min(0),
    salaryType: z.string().default("MONTHLY"),

    // Bank & Benefits
    paymentMethod: z.string().optional(),
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    accountType: z.string().optional(),
    savingsAccount: z.string().optional(),
    savingsEmployeeContribution: z.coerce.number().default(0),
    savingsCompanyContribution: z.coerce.number().default(0),
    foodPension: z.coerce.number().default(0),
    utilitiesPercentage: z.coerce.number().default(0),
    medicalLeavePercentage: z.coerce.number().default(0),
    islrPercentage: z.coerce.number().min(0).max(100).default(0),
    islrQ1: z.coerce.number().default(0),
    islrQ2: z.coerce.number().default(0),
    islrQ3: z.coerce.number().default(0),
    islrQ4: z.coerce.number().default(0),
    unionFee: z.coerce.number().default(0),
    vehicle: z.coerce.number().default(0),
    deductSSO: z.coerce.boolean().default(true),
    deductFAOV: z.coerce.boolean().default(true),
    hcmRetention: z.coerce.number().default(0),
    benefitsDestination: z.string().optional(),
    trustAccount142: z.string().optional(),

    // Identifiers
    passportNumber: z.string().optional(),
    militaryService: z.string().optional(),
    ssn: z.string().optional(),
    licenseGrade: z.string().optional(),
    handedness: z.string().optional(),
    height: z.coerce.number().default(0),
    weight: z.coerce.number().default(0),
    fingerprintId: z.string().optional(),
    familyDependents: z.array(z.any()).optional(),
});

export async function createEmployeeAction(companyId: string, data: any) {
    try {
        await assertCompanyAccess(companyId);
        const tenantDb = await (require("@/lib/tenant-db").getTenantDb(companyId));

        const validated: any = employeeSchema.parse(data);

        // Date conversions
        const dateFields = [
            'birthDate', 'professionalStart', 'hireDate', 'terminationDate',
            'exitDate', 'contractEndDate', 'vacationStartDate',
            'vacationEndDate', 'lastSocialBenefitsDeposit'
        ];

        dateFields.forEach(field => {
            if (validated[field]) {
                validated[field] = new Date(validated[field]);
            } else {
                delete validated[field];
            }
        });

        // Handle nested dependents
        const dependents = validated.familyDependents || [];
        delete validated.familyDependents;

        await tenantDb.employee.create({
            data: {
                ...validated,
                familyDependents: {
                    create: dependents.map((d: any) => ({
                        ...d,
                        birthDate: new Date(d.birthDate)
                    }))
                }
            }
        });

        revalidatePath(`/dashboard/${companyId}/payroll`);
        return { success: true };
    } catch (e: any) {
        console.error("Create Employee Error:", e);
        if (e.code === "P2002") {
            return { error: "Ya existe un empleado con este código o número de cédula (RIF). Verifique los datos." };
        }
        return { error: e.message };
    }
}

// --- Masters ---
export async function createDepartmentAction(companyId: string, name: string) {
    try {
        await assertCompanyAccess(companyId);
        await PayrollRepository.createDepartment(companyId, name);
        revalidatePath(`/dashboard/${companyId}/payroll/masters`);
        return { success: true };
    } catch (e: any) {
        if (e.code === "P2002") return { error: "El departamento ya existe." };
        return { error: e.message };
    }
}

export async function createPositionAction(companyId: string, name: string) {
    try {
        await assertCompanyAccess(companyId);
        await PayrollRepository.createPosition(companyId, name);
        revalidatePath(`/dashboard/${companyId}/payroll/masters`);
        return { success: true };
    } catch (e: any) {
        if (e.code === "P2002") return { error: "El cargo ya existe." };
        return { error: e.message };
    }
}

export async function createConceptAction(companyId: string, data: any) {
    try {
        await assertCompanyAccess(companyId);
        await PayrollRepository.createConcept(companyId, data);
        revalidatePath(`/dashboard/${companyId}/payroll/masters`);
        return { success: true };
    } catch (e: any) {
        if (e.code === "P2002") return { error: "Ya existe un concepto con este código." };
        return { error: e.message };
    }
}

export async function createConstantAction(companyId: string, data: any) {
    try {
        await assertCompanyAccess(companyId);
        await PayrollRepository.createConstant(companyId, data);
        revalidatePath(`/dashboard/${companyId}/payroll/masters`);
        return { success: true };
    } catch (e: any) {
        if (e.code === "P2002") return { error: "Ya existe una constante con este nombre." };
        return { error: e.message };
    }
}

export async function createLoanAction(companyId: string, data: any) {
    try {
        await assertCompanyAccess(companyId);
        await PayrollRepository.createLoan(companyId, data);
        revalidatePath(`/dashboard/${companyId}/payroll`);
        return { success: true };
    } catch (e: any) {
        return { error: e.message };
    }
}

export async function assignConceptAction(companyId: string, data: any) {
    try {
        await assertCompanyAccess(companyId);
        await PayrollRepository.assignConceptToEmployee(companyId, data);
        revalidatePath(`/dashboard/${companyId}/payroll`);
        return { success: true };
    } catch (e: any) {
        return { error: e.message };
    }
}

// --- Payroll Generation ---
export async function generatePayrollAction(companyId: string, data: { type: string; startDate: string; endDate: string; description?: string }) {
    try {
        await assertCompanyAccess(companyId);

        await PayrollRepository.generatePayroll(companyId, {
            type: data.type,
            description: data.description,
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
                islrThreshold: parseFloat(data.islrThreshold || 1000),
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

export async function getPayrollReceiptsAction(companyId: string, payrollId: string) {
    try {
        await assertCompanyAccess(companyId);
        const payroll = await PayrollRepository.getPayrollDetails(companyId, payrollId);
        if (!payroll) throw new Error("Payroll not found");
        return { success: true, data: payroll };
    } catch (e: any) {
        return { error: e.message };
    }
}
// --- Family Dependents ---
const familyDependentSchema = z.object({
    employeeId: z.string(),
    firstName: z.string().min(1, "Nombre es requerido"),
    lastName: z.string().min(1, "Apellido es requerido"),
    relationship: z.string().min(1, "Parentesco es requerido"), // HIJO, CONYUGE, PADRE, MADRE, OTRO
    birthDate: z.string().or(z.date()),
    idNumber: z.string().optional(),
    gender: z.string().optional(),
});

export async function addFamilyDependentAction(companyId: string, data: any) {
    try {
        await assertCompanyAccess(companyId);
        const tenantDb = await (require("@/lib/tenant-db").getTenantDb(companyId));

        const validated: any = familyDependentSchema.parse(data);
        validated.birthDate = new Date(validated.birthDate);

        await tenantDb.familyDependent.create({
            data: validated
        });

        revalidatePath(`/dashboard/${companyId}/payroll`);
        return { success: true };
    } catch (e: any) {
        return { error: e.message };
    }
}

export async function deleteFamilyDependentAction(companyId: string, id: string) {
    try {
        await assertCompanyAccess(companyId);
        const tenantDb = await (require("@/lib/tenant-db").getTenantDb(companyId));

        await tenantDb.familyDependent.delete({
            where: { id }
        });

        revalidatePath(`/dashboard/${companyId}/payroll`);
        return { success: true };
    } catch (e: any) {
        return { error: e.message };
    }
}
