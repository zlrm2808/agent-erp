"use server";

import { UserRepository } from "./repository";
import { revalidatePath } from "next/cache";

export async function createUserAction(formData: FormData, companyId: string) {

    const username = formData.get("username") as string;
    const realName = formData.get("realName") as string;
    const password = formData.get("password") as string;
    const position = formData.get("position") as string;
    const department = formData.get("department") as string;
    const profileId = formData.get("profileId") as string;

    // Retrieve all checked companies
    const selectedCompanies = formData.getAll("companyIds") as string[];
    const companyIdsToAssign = selectedCompanies.length > 0 ? selectedCompanies : [companyId];

    try {
        await UserRepository.createForCompany({
            username,
            realName,
            password,
            position,
            department,
            profileId,
        }, companyIdsToAssign);

        revalidatePath(`/dashboard/${companyId}/settings/users`);
        return { success: true };
    } catch (error: any) {
        // Handle Prismas Unique Constraint Error or custom manual throw
        if (error.message?.includes("Unique constraint") || error.code === "P2002" || error.message === "P2002") {
            return { success: false, error: "El nombre de usuario ya está en uso. Por favor elija otro." };
        }

        console.error("Error creating user:", error);
        return { success: false, error: error.message };
    }
}

export async function updateUserAction(userId: string, companyId: string, formData: FormData) {
    const realName = formData.get("realName") as string;
    const position = formData.get("position") as string;
    const department = formData.get("department") as string;
    const profileId = formData.get("profileId") as string;
    const password = formData.get("password") as string;
    const isActive = formData.get("isActive") === "on";

    try {
        await UserRepository.updateForCompany(userId, companyId, {
            realName,
            position,
            department,
            profileId,
            isActive,
            password
        });

        revalidatePath(`/dashboard/${companyId}/settings/users`);
        return { success: true };
    } catch (error: any) {
        console.error("Error updating user:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteUserAction(userId: string, companyId: string) {
    try {
        await UserRepository.removeFromCompany(userId, companyId);
        revalidatePath(`/dashboard/${companyId}/settings/users`);
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting user:", error);
        return { success: false, error: error.message };
    }
}
