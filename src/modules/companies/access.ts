import { CompanyRepository } from "./repository";
import { getCurrentUser } from "@/modules/auth/session";

export async function assertCompanyAccess(companyId: string) {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error("UNAUTHORIZED");
    }

    const membership = await CompanyRepository.getUserMembership(user.id, companyId);
    if (!membership) {
        throw new Error("FORBIDDEN_COMPANY");
    }

    return { ...user, membership };
}
