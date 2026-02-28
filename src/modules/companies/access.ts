import { CompanyRepository } from "./repository";
import { getCurrentUser } from "@/modules/auth/session";

export async function assertCompanyAccess(companyId: string) {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error("UNAUTHORIZED");
    }

    const hasAccess = await CompanyRepository.userHasAccess(user.id, companyId);
    if (!hasAccess) {
        throw new Error("FORBIDDEN_COMPANY");
    }

    return user;
}
