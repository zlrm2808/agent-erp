import { UserRepository } from "@/modules/users/repository";
import { CompanyRepository } from "@/modules/companies/repository";
import { CreateUserDialog } from "./create-dialog";
import { EditUserDialog } from "./edit-dialog";
import { DeleteUserDialog } from "./delete-dialog";
import { Users, Shield, UserCircle, RotateCcw, FileKey, BadgeCheck, Github } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import * as R from "@/components/ui/MicrosoftRibbon";
import { cn } from "@/lib/utils";

export default async function UsersPage({ params }: { params: Promise<{ companyId: string }> }) {
    const { companyId } = await params;
    const users = await UserRepository.findByCompanyId(companyId);
    const profiles = await UserRepository.getProfiles(companyId);
    const allCompanies = await CompanyRepository.findAll();

    return (
        <div className="space-y-0 -m-6 flex flex-col h-full overflow-hidden">
            <R.RibbonContainer>
                <div className="flex items-stretch overflow-x-auto no-scrollbar">
                    <R.RibbonGroup label="Gestionar">
                        <CreateUserDialog
                            companyId={companyId}
                            profiles={profiles}
                            allCompanies={allCompanies}
                            trigger={<R.RibbonBtnLarge icon="UserPlus" label="Nuevo Usuario" color="text-[#0078d4]" />}
                        />
                        <R.RibbonBtnLarge icon="RotateCcw" label="Refrescar" href="" />
                    </R.RibbonGroup>
                    <R.RibbonGroup label="Seguridad">
                        <R.RibbonBtnLarge icon="Shield" label="Roles" href="" />
                        <R.RibbonBtnLarge icon="FileKey" label="Permisos" href="" />
                    </R.RibbonGroup>
                </div>
            </R.RibbonContainer>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e1dfdd] pb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-sky-50 rounded-sm">
                            <Users className="text-[#0078d4] w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-[#323130] tracking-tight uppercase">
                                Usuarios y Perfiles
                            </h2>
                            <p className="text-[11px] text-[#605e5c] font-medium uppercase tracking-wider">
                                Gestión de accesos y seguridad de la empresa
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-[#e1dfdd] shadow-sm rounded-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#faf9f8] border-b border-[#e1dfdd]">
                                <th className="px-6 py-3 text-[10px] font-black uppercase text-[#605e5c] tracking-widest">Identidad</th>
                                <th className="px-6 py-3 text-[10px] font-black uppercase text-[#605e5c] tracking-widest">Cargo / Depto</th>
                                <th className="px-6 py-3 text-[10px] font-black uppercase text-[#605e5c] tracking-widest">Perfil</th>
                                <th className="px-6 py-3 text-[10px] font-black uppercase text-[#605e5c] tracking-widest">Estado</th>
                                <th className="px-6 py-3 text-[10px] font-black uppercase text-[#605e5c] tracking-widest">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f3f2f1]">
                            {users.map((user: any) => {
                                const membership = user.companies[0];
                                const profileName = membership?.profile?.name || "Sin Perfil";

                                return (
                                    <tr key={user.id} className="hover:bg-[#faf9f8] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border border-[#d2d0ce]">
                                                    {user.photo ? (
                                                        <img src={user.photo} alt={user.realName || ""} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <AvatarFallback className="bg-sky-100 text-[#0078d4] font-bold">
                                                            {user.realName?.[0] || user.username[0]}
                                                        </AvatarFallback>
                                                    )}
                                                </Avatar>
                                                <div>
                                                    <div className="text-sm font-black text-[#323130] uppercase leading-tight">
                                                        {user.realName || "Usuario sin nombre"}
                                                    </div>
                                                    <div className="text-[10px] text-[#605e5c] font-mono">
                                                        @{user.username}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-[10px] font-bold text-[#323130] uppercase">
                                                    {user.position || "Consultor"}
                                                </div>
                                                <div className="text-[9px] text-[#605e5c] uppercase">
                                                    {user.department || "Administración"}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <div className={cn(
                                                    "px-2 py-0.5 text-[10px] font-black rounded-full uppercase tracking-tighter border",
                                                    profileName === "Administrador" ? "bg-red-50 text-red-700 border-red-200" :
                                                        profileName === "Desarrollador" ? "bg-purple-50 text-purple-700 border-purple-200" :
                                                            "bg-sky-50 text-[#0078d4] border-sky-100"
                                                )}>
                                                    {profileName}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full ring-2 ring-white",
                                                    user.isActive ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]" : "bg-slate-300"
                                                )} />
                                                <span className={cn(
                                                    "text-[10px] font-bold uppercase",
                                                    user.isActive ? "text-green-700" : "text-slate-500"
                                                )}>
                                                    {user.isActive ? "Activo" : "Inactivo"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <EditUserDialog companyId={companyId} user={user} profiles={profiles} />
                                                <span className="mx-2 text-[#e1dfdd]">|</span>
                                                <DeleteUserDialog companyId={companyId} userId={user.id} userName={user.realName || user.username} />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {users.length === 0 && (
                        <div className="p-12 text-center">
                            <UserCircle className="h-12 w-12 text-[#d2d0ce] mx-auto mb-4" />
                            <p className="text-sm text-[#605e5c]">No hay usuarios registrados para esta empresa.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
