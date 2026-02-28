"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthRepository } from "./repository";

export async function logoutAction() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (token) {
        await AuthRepository.deleteSessionByToken(token);
    }

    cookieStore.delete("auth_token");
    redirect("/login");
}
