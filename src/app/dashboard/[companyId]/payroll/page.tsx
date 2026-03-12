import { PayrollRepository } from "@/modules/payroll/repository";
import { PayrollDashboardClient } from "@/modules/payroll/components/payroll-dashboard-client";

export default async function PayrollPage({
    params
}: {
    params: Promise<{ companyId: string }>;
}) {
    const { companyId } = await params;
    const [employees, history, departments, positions] = await Promise.all([
        PayrollRepository.getEmployees(companyId),
        PayrollRepository.getPayrollHistory(companyId),
        PayrollRepository.getDepartments(companyId),
        PayrollRepository.getPositions(companyId)
    ]);

    return (
        <PayrollDashboardClient
            companyId={companyId}
            initialEmployees={employees}
            initialHistory={history}
            departments={departments}
            positions={positions}
        />
    );
}
