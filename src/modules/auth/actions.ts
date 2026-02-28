"use server";

import { loginSchema, type LoginValues } from "./schema";
import { AuthRepository } from "./repository";
import { cookies } from "next/headers";
import { hashPassword, isHashedPassword, verifyPassword } from "./password";

/**
 * loginAction - Server Action for user authentication.
 * 
 * Pro-Tip: Always use Server Actions for sensitive logic to keep
 * secrets (like DB connection or hashing) on the server.
 */
export async function loginAction(data: LoginValues) {
    // 1. Validate data with Zod (Always validate on the server!)
    const validated = loginSchema.safeParse(data);
    if (!validated.success) {
        return { error: "Datos de entrada inválidos." };
    }

    const { username, password } = validated.data;

    try {
        // 2. Find user in Database
        const user = await AuthRepository.findByUsername(username);

        if (!user) {
            return { error: "Usuario o contraseña incorrectos." };
        }

        // 3. Verify Password
        const isValidPassword = await verifyPassword(password, user.password);
        if (!isValidPassword) {
            return { error: "Usuario o contraseña incorrectos." };
        }

        if (!isHashedPassword(user.password)) {
            await AuthRepository.updatePassword(user.id, await hashPassword(password));
        }

        // 4. Create Session
        const token = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

        await AuthRepository.invalidateUserSessions(user.id);
        await AuthRepository.createSession(user.id, token, expiresAt);

        // 5. Set Cookie
        const cookieStore = await cookies();
        cookieStore.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            expires: expiresAt,
            sameSite: "lax",
            path: "/",
        });

        return { success: true };
    } catch (err) {
        console.error("Login error:", err);
        return { error: "Ocurrió un error inesperado en el servidor." };
    }
}
