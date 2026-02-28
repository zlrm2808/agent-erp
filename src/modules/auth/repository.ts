import { db } from "@/lib/orm";
import type { Session, User } from "@prisma/client";

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
     * Updates a user password hash
     */
    async updatePassword(userId: string, password: string): Promise<User> {
        return db.user.update({
            where: { id: userId },
            data: { password },
        });
    },

    /**
     * Invalidates all active sessions for a specific user.
     */
    async invalidateUserSessions(userId: string): Promise<{ count: number }> {
        return db.session.deleteMany({ where: { userId } });
    },

    /**
     * Creates a new session for a user
     */
    async createSession(userId: string, token: string, expiresAt: Date): Promise<Session> {
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

    /**
     * Deletes session by token.
     */
    async deleteSessionByToken(token: string): Promise<{ count: number }> {
        return db.session.deleteMany({ where: { token } });
    },
};
