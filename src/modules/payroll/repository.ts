import { getTenantDb } from "@/lib/tenant-db";

export const PayrollRepository = {
    /**
     * Gets global payroll parameters
     */
    async getParameters(companyId: string) {
        const tenantDb = await getTenantDb(companyId);
        return tenantDb.payrollParameter.upsert({
            where: { id: "payroll-params" },
            update: {},
            create: {
                id: "payroll-params",
                minWage: 130, // Default Bs.
                mealTicket: 1440, // Base Cestaticket
                taxUnit: 9,
                ivssRate: 0.04,
                faovRate: 0.01,
                lpeRate: 0.005,
            }
        });
    },

    /**
     * Calculation engine for a payroll line item
     */
    async calculatePayrollDetail(companyId: string, employee: any, payroll: any, params: any) {
        const earnings = [];
        const deductions = [];

        const type = payroll.type;
        const isQuincenal = type === "QUINCENAL";
        const isMensual = type === "MENSUAL";
        const isSemanal = type === "SEMANAL";
        const isCestaticket = type === "CESTATICKET";

        // Logic factors
        const factor = isQuincenal ? 0.5 : (isSemanal ? (7 / 30) : 1.0);
        const weeks = isQuincenal ? 2 : (isSemanal ? 1 : 4);

        // 1. Basic Salary (Skipped if CESTATICKET only run)
        if (!isCestaticket) {
            const basicSalary = employee.baseSalary * factor;
            earnings.push({
                code: "001",
                name: isSemanal ? "Sueldo Semanal" : "Sueldo Básico",
                type: "EARNING",
                amount: basicSalary
            });
        }

        // 2. Cestaticket (Art. 7 Cestaticket Socialista)
        // If it's a specific CESTATICKET run, we pay the full month or the period
        if (isCestaticket || isQuincenal || isMensual || isSemanal) {
            const ctFactor = isSemanal ? (7 / 30) : (isQuincenal ? 0.5 : 1.0);
            earnings.push({
                code: "005",
                name: "Cestaticket Socialista",
                type: "EARNING",
                amount: params.mealTicket * ctFactor
            });
        }

        const totalEarningsBeforeDeductions = earnings.reduce((sum, item) => sum + item.amount, 0);

        // --- DEDUCTIONS ---
        // Deductions only apply if it's not a CESTATICKET run (which is a non-salary benefit)
        if (!isCestaticket && type !== "HONORARIOS") {
            const weeklySalary = (employee.baseSalary * 12) / 52;
            const cappedWeekly = Math.min(weeklySalary, (params.minWage * 5 * 12) / 52);

            // 3. Social Security (IVSS)
            const ivssAmount = cappedWeekly * weeks * params.ivssRate;
            deductions.push({
                code: "501",
                name: `I.V.S.S. (4% - ${weeks} sem)`,
                type: "DEDUCTION",
                amount: ivssAmount
            });

            // 4. Lost Policy (Paro Forzoso / RPE)
            const lpeAmount = cappedWeekly * weeks * params.lpeRate;
            deductions.push({
                code: "502",
                name: "R.P.E. / Paro Forzoso",
                type: "DEDUCTION",
                amount: lpeAmount
            });

            // 5. FAOV / LPH (1% of base salary earnings)
            const baseForFaov = earnings.find(e => e.code === "001")?.amount || 0;
            const faovAmount = baseForFaov * params.faovRate;
            if (faovAmount > 0) {
                deductions.push({
                    code: "503",
                    name: "F.A.O.V. (1%)",
                    type: "DEDUCTION",
                    amount: faovAmount
                });
            }
        }

        const totalDeductions = deductions.reduce((sum, item) => sum + item.amount, 0);
        const netAmount = totalEarningsBeforeDeductions - totalDeductions;

        return {
            earnings,
            deductions,
            totalEarnings: totalEarningsBeforeDeductions,
            totalDeductions,
            totalNet: netAmount
        };
    },

    /**
     * Generation of a full payroll run
     */
    async generatePayroll(companyId: string, data: { type: string; startDate: Date; endDate: Date }) {
        const tenantDb = await getTenantDb(companyId);
        const params = await this.getParameters(companyId);

        const employees = await tenantDb.employee.findMany({ where: { isActive: true } });

        return tenantDb.$transaction(async (tx) => {
            const payroll = await tx.payroll.create({
                data: {
                    type: data.type,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    period: `${data.startDate.toISOString().split('T')[0]} - ${data.endDate.toISOString().split('T')[0]}`,
                    status: "DRAFT"
                }
            });

            let globalEarnings = 0;
            let globalDeductions = 0;

            for (const emp of employees) {
                const calc = await this.calculatePayrollDetail(companyId, emp, payroll, params);

                const detail = await tx.payrollDetail.create({
                    data: {
                        payrollId: payroll.id,
                        employeeId: emp.id,
                        employeeName: `${emp.firstName} ${emp.lastName}`,
                        employeeIdNumber: emp.idNumber,
                        baseSalary: emp.baseSalary,
                        totalEarnings: calc.totalEarnings,
                        totalDeductions: calc.totalDeductions,
                        totalNet: calc.totalNet,
                        items: {
                            create: [...calc.earnings, ...calc.deductions].map(it => ({
                                code: it.code,
                                name: it.name,
                                type: it.type,
                                amount: it.amount
                            }))
                        }
                    }
                });

                globalEarnings += calc.totalEarnings;
                globalDeductions += calc.totalDeductions;
            }

            // Update Payroll totals
            return tx.payroll.update({
                where: { id: payroll.id },
                data: {
                    totalEarnings: globalEarnings,
                    totalDeductions: globalDeductions,
                    totalNet: globalEarnings - globalDeductions
                }
            });
        });
    },

    /**
     * CRUD for Employees
     */
    async getEmployees(companyId: string) {
        const tenantDb = await getTenantDb(companyId);
        return tenantDb.employee.findMany({ orderBy: { lastName: 'asc' } });
    },

    /**
     * Get Payroll History
     */
    async getPayrollHistory(companyId: string) {
        const tenantDb = await getTenantDb(companyId);
        return tenantDb.payroll.findMany({
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { details: true } } }
        });
    },

    /**
     * Get Detailed Payroll for Report
     */
    async getPayrollDetails(companyId: string, payrollId: string) {
        const tenantDb = await getTenantDb(companyId);
        return tenantDb.payroll.findUnique({
            where: { id: payrollId },
            include: {
                details: {
                    include: {
                        employee: true,
                        items: true
                    }
                }
            }
        });
    },

    /**
     * Export Bank File (TXT)
     */
    async generateBankFile(companyId: string, payrollId: string, bank: "BANESCO" | "BBVA") {
        const payroll = await this.getPayrollDetails(companyId, payrollId);
        if (!payroll) throw new Error("Payroll not found");

        let content = "";

        if (bank === "BANESCO") {
            // Standard format: AccountNumber(20)|ID(12)|Name(40)|Amount(15)|Type(1)
            // Example simplified: Account;ID;Amount
            content = payroll.details.map(d => {
                const acc = (d.employee.accountNumber || "00000000000000000000").padEnd(20);
                const id = d.employeeIdNumber.replace(/[^0-9]/g, "").padStart(12, "0");
                const amount = d.totalNet.toFixed(2).replace(".", "").padStart(15, "0");
                return `${acc}${id}${amount}`;
            }).join("\n");
        } else {
            // BBVA / Others: CSV style
            content = "CI,Nombre,Cuenta,Monto\n";
            content += payroll.details.map(d =>
                `${d.employeeIdNumber},${d.employeeName},${d.employee.accountNumber},${d.totalNet.toFixed(2)}`
            ).join("\n");
        }

        return content;
    },

    /**
     * Calculate Employer Contributions Report
     */
    async getEmployerReports(companyId: string, payrollId: string) {
        const payroll = await this.getPayrollDetails(companyId, payrollId);
        const params = await this.getParameters(companyId);
        if (!payroll) throw new Error("Payroll not found");

        // Logic:
        // IVSS Employer: 11% (Private company risk max)
        // RPE Employer: 2%
        // FAOV Employer: 2%
        // INCES Employer: 2% (on earnings)

        let totalIvss = 0;
        let totalRpe = 0;
        let totalFaov = 0;
        let totalInces = 0;

        for (const detail of payroll.details) {
            const weeklySalary = (detail.baseSalary * 12) / 52;
            const cappedWeekly = Math.min(weeklySalary, (params.minWage * 5 * 12) / 52);
            const weeks = payroll.type === "QUINCENAL" ? 2 : 4;

            totalIvss += cappedWeekly * weeks * 0.11;
            totalRpe += cappedWeekly * weeks * 0.02;
            totalFaov += detail.totalEarnings * 0.02;
            totalInces += detail.totalEarnings * 0.02;
        }

        return {
            payrollId: payroll.id,
            payrollPeriod: payroll.period,
            totalNet: payroll.totalNet,
            employerCosts: {
                ivss: totalIvss,
                rpe: totalRpe,
                faov: totalFaov,
                inces: totalInces,
                total: totalIvss + totalRpe + totalFaov + totalInces
            }
        };
    },

    /**
     * Social Benefits (Prestaciones Sociales) - Art. 142 LOTTT
     */
    async getSocialBenefits(companyId: string, employeeId: string) {
        const tenantDb = await getTenantDb(companyId);
        const employee = await tenantDb.employee.findUnique({ where: { id: employeeId } });
        if (!employee) throw new Error("Employee not found");

        const hireDate = new Date(employee.hireDate);
        const now = new Date();
        const monthsDiff = (now.getFullYear() - hireDate.getFullYear()) * 12 + (now.getMonth() - hireDate.getMonth());

        // 1. Garantía de Prestaciones (15 days per quarter = 5 days per month)
        const totalGuaranteeDays = monthsDiff * 5;
        const dailySalary = employee.baseSalary / 30; // Simplified base
        const guaranteeAmount = totalGuaranteeDays * dailySalary;

        // 2. Días Adicionales (2 days per year, max 30)
        const yearsDiff = Math.floor(monthsDiff / 12);
        let additionalDays = 0;
        if (yearsDiff >= 1) {
            additionalDays = Math.min(yearsDiff * 2, 30);
        }
        const additionalAmount = additionalDays * dailySalary;

        return {
            employeeName: `${employee.firstName} ${employee.lastName}`,
            hireDate: employee.hireDate,
            antiquityMonths: monthsDiff,
            guarantee: {
                days: totalGuaranteeDays,
                amount: guaranteeAmount
            },
            additional: {
                days: additionalDays,
                amount: additionalAmount
            },
            totalBenefits: guaranteeAmount + additionalAmount
        };
    },

    /**
     * Resumen de Costos por Departamento
     */
    async getCostSummaryByDepartment(companyId: string, payrollId: string) {
        const payroll = await this.getPayrollDetails(companyId, payrollId);
        const params = await this.getParameters(companyId);
        if (!payroll) throw new Error("Payroll not found");

        const summary: Record<string, {
            department: string;
            employees: number;
            netSalary: number;
            employerIvss: number;
            employerRpe: number;
            employerFaov: number;
            employerInces: number;
            totalCost: number;
        }> = {};

        for (const detail of payroll.details) {
            const dept = detail.employee.department || "Sin Departamento";
            if (!summary[dept]) {
                summary[dept] = {
                    department: dept,
                    employees: 0,
                    netSalary: 0,
                    employerIvss: 0,
                    employerRpe: 0,
                    employerFaov: 0,
                    employerInces: 0,
                    totalCost: 0
                };
            }

            // Calculation Logic (same as Employer Reports but per employee)
            const weeklySalary = (detail.baseSalary * 12) / 52;
            const cappedWeekly = Math.min(weeklySalary, (params.minWage * 5 * 12) / 52);
            const weeks = payroll.type === "QUINCENAL" ? 2 : 4;

            const ivss = cappedWeekly * weeks * 0.11;
            const rpe = cappedWeekly * weeks * 0.02;
            const faov = detail.totalEarnings * 0.02;
            const inces = detail.totalEarnings * 0.02;

            summary[dept].employees++;
            summary[dept].netSalary += detail.totalNet;
            summary[dept].employerIvss += ivss;
            summary[dept].employerRpe += rpe;
            summary[dept].employerFaov += faov;
            summary[dept].employerInces += inces;
            summary[dept].totalCost += detail.totalNet + ivss + rpe + faov + inces;
        }

        return Object.values(summary);
    }
};



