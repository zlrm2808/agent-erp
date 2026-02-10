import { cookies } from "next/headers";
import { AuthRepository } from "./repository";

/**
 * Gets the current logged-in user securely from the session token.
 */
export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    const session = await AuthRepository.getSession(token);

    if (!session || session.expiresAt < new Date()) {
        return null;
    }

    return session.user;
}
