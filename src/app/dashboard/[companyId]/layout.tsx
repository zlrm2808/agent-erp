import { Sidebar } from "@/modules/dashboard/sidebar";
import { Topbar } from "@/modules/dashboard/topbar";
import { assertCompanyAccess } from "@/modules/companies/access";
import { redirect } from "next/navigation";

import { OfflineSyncProvider } from "@/components/providers/offline-sync-provider";
import { BranchProvider } from "@/components/providers/branch-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { CompanyRepository } from "@/modules/companies/repository";
import { OrganizationRepository } from "@/modules/organization/repository";

export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ companyId: string }>;
}) {
    const { companyId } = await params;
    const user = await assertCompanyAccess(companyId).catch(() => null);

    if (!user) {
        redirect("/dashboard");
    }

    let branches: { id: string; name: string }[] = [];
    let companyName = "Empresa";

    try {
        console.log(`[DashboardLayout] Fetching data for company: ${companyId}`);
        const [company, rawBranches] = await Promise.all([
            CompanyRepository.findById(companyId),
            OrganizationRepository.getBranches(companyId)
        ]);

        if (company) companyName = company.name;
        branches = rawBranches.map(b => ({ id: b.id, name: b.name }));

        console.log(`[DashboardLayout] Data loaded for ${companyName}.`);
    } catch (error) {
        console.error(`[DashboardLayout] Error loading company data for ${companyId}:`, error);
    }

    return (
        <NuqsAdapter>
            <BranchProvider>
                <OfflineSyncProvider companyId={companyId}>

                    <div className="flex h-screen bg-[#faf9f8]">
                        <Sidebar companyId={companyId} user={user} />
                        <div className="flex-1 flex flex-col overflow-hidden">
                            <Topbar
                                companyId={companyId}
                                companyName={companyName}
                                initialBranches={branches}
                            />

                            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6 custom-scrollbar">
                                <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {children}
                                </div>
                            </main>
                        </div>
                    </div>
                </OfflineSyncProvider>
            </BranchProvider>
        </NuqsAdapter>
    );
}


