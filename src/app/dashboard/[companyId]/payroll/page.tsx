import { PayrollRepository } from "@/modules/payroll/repository";
import { PayrollDashboardClient } from "@/modules/payroll/components/payroll-dashboard-client";

export default async function PayrollPage({
    params
}: {
    params: Promise<{ companyId: string }>;
}) {
    const { companyId } = await params;
    const [employees, history] = await Promise.all([
        PayrollRepository.getEmployees(companyId),
        PayrollRepository.getPayrollHistory(companyId)
    ]);

    return (
        <PayrollDashboardClient
            companyId={companyId}
            initialEmployees={employees}
            initialHistory={history}
        />
    );
}
