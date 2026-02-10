import { getCurrentUser } from "@/modules/auth/session";
import { getCompaniesAction } from "@/modules/companies/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Plus, ArrowRight, Briefcase } from "lucide-react";
import Link from "next/link";
import { AddCompanyCard } from "@/modules/companies/add-company-card";

export default async function CompaniesPage() {
    const user = await getCurrentUser();
    const companiesResponse = await getCompaniesAction();
    const companies = companiesResponse.success ? companiesResponse.companies : [];

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
            <div className="w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900">
                        Bienvenido, <span className="text-primary">{user?.realName || user?.username}</span>
                    </h1>
                    <p className="text-slate-500 text-lg">Selecciona una empresa para comenzar a trabajar</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {companies?.map((company: any) => (
                        <Link key={company.id} href={`/dashboard/${company.id}/overview`}>
                            <Card className="group h-full cursor-pointer border-none shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 overflow-hidden bg-white">
                                <div className="h-2 w-full bg-primary/20 group-hover:bg-primary transition-colors" />
                                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                    <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-primary/10 transition-colors">
                                        <Building2 className="text-slate-400 group-hover:text-primary transition-colors" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">{company.name}</CardTitle>
                                        <CardDescription className="text-xs font-mono">{company.rif}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center text-primary text-sm font-bold opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                                        Entrar ahora <ArrowRight size={14} className="ml-2" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}

                    {/* Create Company Card */}
                    <AddCompanyCard />
                </div>
            </div>
        </div>
    );
}
