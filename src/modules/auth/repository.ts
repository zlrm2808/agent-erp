import { db } from "@/lib/orm";
import type { User } from "@prisma/client";

/**
 * Authentication Repository
 * Handles user-related database operations for authentication.
 */
export const AuthRepository = {
    /**
     * Finds a user by their unique username
     */
    async findByUsername(username: string): Promise<User | null> {
        return db.user.findUnique({
            where: { username },
        });
    },

    /**
     * Creates a new session for a user
     */
    async createSession(userId: string, token: string, expiresAt: Date) {
        return db.session.create({
            data: {
                userId,
                token,
                expiresAt,
            },
        });
    },

    /**
     * Finds a session by its unique token and includes the associated user
     */
    async getSession(token: string) {
        return db.session.findUnique({
            where: { token },
            include: { user: true },
        });
    },
};
