import { Sidebar } from "@/modules/dashboard/sidebar";
import { Topbar } from "@/modules/dashboard/topbar";
import { assertCompanyAccess } from "@/modules/companies/access";
import { redirect } from "next/navigation";

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

    return (
        <div className="flex h-screen bg-[#faf9f8]">
            <Sidebar companyId={companyId} user={user} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6 custom-scrollbar">
                    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
