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
    async calculatePayrollDetail(companyId: string, employee: any, payroll: any, params: any, context: { constants: any[], employeeConcepts: any[], activeLoans: any[] }) {
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
        if (isCestaticket || isQuincenal || isMensual || isSemanal) {
            const ctFactor = isSemanal ? (7 / 30) : (isQuincenal ? 0.5 : 1.0);
            earnings.push({
                code: "005",
                name: "Cestaticket Socialista",
                type: "EARNING",
                amount: params.mealTicket * ctFactor
            });
        }

        // 3. Process Fixed Employee Concepts (Asignaciones/Deducciones fijas)
        for (const ec of context.employeeConcepts) {
            const amount = ec.amount || 0;
            if (ec.concept.type === "EARNING") {
                earnings.push({
                    code: ec.concept.code,
                    name: ec.concept.name,
                    type: "EARNING",
                    amount: amount * factor // Multiplied by factor if it's a monthly bonus split in fortnights
                });
            } else {
                deductions.push({
                    code: ec.concept.code,
                    name: ec.concept.name,
                    type: "DEDUCTION",
                    amount: amount * factor
                });
            }
        }

        // 4. Process Active Loans (Préstamos)
        for (const loan of context.activeLoans) {
            // Only deduct in the first fortnight if quincenal, or always if monthly/weekly
            const shouldDeduct = !isQuincenal || (new Date(payroll.startDate).getDate() <= 15);

            if (shouldDeduct && loan.remainingInstallments > 0) {
                deductions.push({
                    code: "800", // Loan code
                    name: `Cuota Préstamo (${loan.totalInstallments - loan.remainingInstallments + 1}/${loan.totalInstallments})`,
                    type: "DEDUCTION",
                    amount: loan.installmentAmount,
                    loanId: loan.id // Store internally to update later
                });
            }
        }

        const totalEarningsBeforeDeductions = earnings.reduce((sum, item) => sum + item.amount, 0);

        // --- STATUTORY DEDUCTIONS (Ley) ---
        if (!isCestaticket && type !== "HONORARIOS") {
            const weeklySalary = (employee.baseSalary * 12) / 52;
            const cappedWeekly = Math.min(weeklySalary, (params.minWage * params.maxIvssSalary * 12) / 52);

            // 5. IVSS (4%)
            const ivssAmount = cappedWeekly * weeks * params.ivssRate;
            deductions.push({
                code: "501",
                name: `I.V.S.S. (4% - ${weeks} sem)`,
                type: "DEDUCTION",
                amount: ivssAmount
            });

            // 6. R.P.E. / Paro Forzoso (0.5%)
            const lpeAmount = cappedWeekly * weeks * params.lpeRate;
            deductions.push({
                code: "502",
                name: "R.P.E. / Paro Forzoso",
                type: "DEDUCTION",
                amount: lpeAmount
            });

            // 7. F.A.O.V. (1% of base + other salary concepts)
            // Note: Cestaticket and certain bonuses aren't salary, but most assigned concepts are.
            const faovBase = earnings
                .filter(e => e.code !== "005") // Exclude Cestaticket
                .reduce((sum, it) => sum + it.amount, 0);

            const faovAmount = faovBase * params.faovRate;
            if (faovAmount > 0) {
                deductions.push({
                    code: "503",
                    name: "F.A.O.V. (1%)",
                    type: "DEDUCTION",
                    amount: faovAmount
                });
            }

            // 8. I.S.L.R. (Calculado sobre el total de asignaciones gravables según porcentaje AR-I)
            if (employee.islrPercentage > 0) {
                const taxableBase = earnings
                    .filter(e => e.code !== "005") // Cestaticket no es gravable
                    .reduce((sum, it) => sum + it.amount, 0);

                const islrAmount = taxableBase * (employee.islrPercentage / 100);
                if (islrAmount > 0) {
                    deductions.push({
                        code: "505",
                        name: `I.S.L.R. (${employee.islrPercentage}%)`,
                        type: "DEDUCTION",
                        amount: islrAmount
                    });
                }
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
    async generatePayroll(companyId: string, data: { type: string; description?: string; startDate: Date; endDate: Date }) {
        const tenantDb = await getTenantDb(companyId);
        const params = await this.getParameters(companyId);

        // Fetch all context data once
        const [employees, constants, globalConcepts] = await Promise.all([
            tenantDb.employee.findMany({
                where: { isActive: true },
                include: {
                    fixedConcepts: { include: { concept: true }, where: { isActive: true } },
                    loans: { where: { status: "ACTIVE" } }
                }
            }),
            tenantDb.payrollConstant.findMany(),
            tenantDb.payrollConcept.findMany({ where: { isActive: true } })
        ]);

        return tenantDb.$transaction(async (tx) => {
            const payroll = await tx.payroll.create({
                data: {
                    type: data.type,
                    description: data.description,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    period: `${data.startDate.toISOString().split('T')[0]} - ${data.endDate.toISOString().split('T')[0]}`,
                    status: "DRAFT"
                }
            });

            let globalEarnings = 0;
            let globalDeductions = 0;

            for (const emp of employees) {
                const calc = await this.calculatePayrollDetail(companyId, emp, payroll, params, {
                    constants,
                    employeeConcepts: (emp as any).fixedConcepts,
                    activeLoans: (emp as any).loans
                });

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
                                conceptId: (it as any).conceptId,
                                code: it.code,
                                name: it.name,
                                type: it.type,
                                amount: it.amount
                            }))
                        }
                    }
                });

                // Update Loan balances if installments were deducted
                const loanDeductions = calc.deductions.filter(d => (d as any).loanId);
                for (const ld of loanDeductions) {
                    const loanId = (ld as any).loanId;
                    const amount = ld.amount;

                    const loan = await tx.loan.findUnique({ where: { id: loanId } });
                    if (loan) {
                        const newRemaining = loan.remainingInstallments - 1;
                        await tx.loan.update({
                            where: { id: loanId },
                            data: {
                                remainingInstallments: newRemaining,
                                status: newRemaining <= 0 ? "PAID" : "ACTIVE"
                            }
                        });

                        await tx.loanInstallment.create({
                            data: {
                                loanId: loanId,
                                payrollDetailId: detail.id,
                                amount: amount
                            }
                        });
                    }
                }

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
        return tenantDb.employee.findMany({
            orderBy: { lastName: 'asc' },
            include: {
                familyDependents: true,
                fixedConcepts: { include: { concept: true } },
                loans: { where: { status: 'ACTIVE' } }
            }
        });
    },

    /**
     * Masters: Departments and Job Positions
     */
    async getDepartments(companyId: string) {
        const tenantDb = await getTenantDb(companyId);
        return tenantDb.department.findMany({ orderBy: { name: 'asc' } });
    },

    async createDepartment(companyId: string, name: string) {
        const tenantDb = await getTenantDb(companyId);
        return tenantDb.department.create({ data: { name } });
    },

    async getPositions(companyId: string) {
        const tenantDb = await getTenantDb(companyId);
        return tenantDb.jobPosition.findMany({ orderBy: { name: 'asc' } });
    },

    async createPosition(companyId: string, name: string) {
        const tenantDb = await getTenantDb(companyId);
        return tenantDb.jobPosition.create({ data: { name } });
    },

    /**
     * Masters: Concepts, Constants, Loans
     */
    async getConcepts(companyId: string) {
        const tenantDb = await getTenantDb(companyId);
        return tenantDb.payrollConcept.findMany({ orderBy: { code: 'asc' } });
    },

    async createConcept(companyId: string, data: any) {
        const tenantDb = await getTenantDb(companyId);
        return tenantDb.payrollConcept.create({ data });
    },

    async getConstants(companyId: string) {
        const tenantDb = await getTenantDb(companyId);
        return tenantDb.payrollConstant.findMany({ orderBy: { key: 'asc' } });
    },

    async createConstant(companyId: string, data: any) {
        const tenantDb = await getTenantDb(companyId);
        return tenantDb.payrollConstant.create({ data });
    },

    async getLoans(companyId: string, employeeId?: string) {
        const tenantDb = await getTenantDb(companyId);
        return tenantDb.loan.findMany({
            where: employeeId ? { employeeId } : {},
            include: { employee: true, installments: true },
            orderBy: { createdAt: 'desc' }
        });
    },

    async createLoan(companyId: string, data: any) {
        const tenantDb = await getTenantDb(companyId);
        return tenantDb.loan.create({
            data: {
                employeeId: data.employeeId,
                amount: data.amount,
                description: data.description,
                startDate: new Date(data.startDate),
                totalInstallments: parseInt(data.totalInstallments),
                remainingInstallments: parseInt(data.totalInstallments),
                installmentAmount: data.amount / parseInt(data.totalInstallments),
                status: "ACTIVE"
            }
        });
    },

    async assignConceptToEmployee(companyId: string, data: { employeeId: string, conceptId: string, amount: number }) {
        const tenantDb = await getTenantDb(companyId);
        return tenantDb.employeeConcept.upsert({
            where: {
                employeeId_conceptId: {
                    employeeId: data.employeeId,
                    conceptId: data.conceptId
                }
            },
            update: { amount: data.amount, isActive: true },
            create: {
                employeeId: data.employeeId,
                conceptId: data.conceptId,
                amount: data.amount
            }
        });
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



