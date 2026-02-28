import { cookies } from "next/headers";
import { AuthRepository } from "./repository";

/**
 * Gets the current logged-in user securely from the session token.
 */
export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        return null;
    }

    const session = await AuthRepository.getSession(token);

    if (!session) {
        return null;
    }

    if (session.expiresAt < new Date()) {
        await AuthRepository.deleteSessionByToken(token);
        return null;
    }

    return session.user;
}
