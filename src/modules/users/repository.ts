import { db } from "@/lib/orm";
import { hashPassword } from "@/modules/auth/password";

export const UserRepository = {
    /**
     * Gets all users associated with a company
     */
    async findByCompanyId(companyId: string) {
        return db.user.findMany({
            where: {
                companies: {
                    some: {
                        companyId,
                    },
                },
            },
            include: {
                companies: {
                    where: {
                        companyId,
                    },
                    include: {
                        profile: true
                    },
                },
            },
        });
    },

    /**
     * Gets available profiles for selection
     */
    async getProfiles(companyId?: string) {
        return db.profile.findMany({
            where: {
                OR: [
                    { companyId: null },
                    { companyId: companyId }
                ]
            }
        });
    },

    async findById(userId: string, companyId: string) {
        return db.user.findFirst({
            where: {
                id: userId,
                companies: {
                    some: { companyId }
                }
            },
            include: {
                companies: {
                    where: { companyId },
                    include: { profile: true }
                }
            }
        });
    },

    /**
     * Creates a new user and associates them with a company
     */
    async createForCompany(data: {
        username: string;
        password: string;
        realName: string;
        position?: string;
        department?: string;
        profileId?: string;
    }, companyIds: string[]) {
        // Enforce unique username check explicitly to avoid noisy Prisma constraint errors
        const existingUser = await db.user.findUnique({
            where: { username: data.username }
        });

        if (existingUser) {
            throw new Error("P2002"); // Unique constraint code
        }

        const hashedPassword = await hashPassword(data.password);

        return db.user.create({
            data: {
                username: data.username,
                password: hashedPassword,
                realName: data.realName,
                position: data.position || "Consultor",
                department: data.department || "Administración",
                companies: {
                    create: companyIds.map(compId => ({
                        companyId: compId,
                        role: "member", // Legacy role
                        profileId: data.profileId,
                    })),
                },
            },
        });
    },

    /**
     * Updates an existing user and their company membership
     */
    async updateForCompany(userId: string, companyId: string, data: {
        realName?: string;
        position?: string;
        department?: string;
        profileId?: string;
        isActive?: boolean;
        password?: string;
    }) {
        const { realName, position, department, isActive, profileId, password } = data;

        const userData: any = {
            realName,
            position,
            department,
            isActive
        };

        if (password && password.trim() !== "") {
            userData.password = await hashPassword(password);
        }

        return db.$transaction([
            db.user.update({
                where: { id: userId },
                data: userData
            }),
            db.userCompany.update({
                where: {
                    userId_companyId: {
                        userId,
                        companyId
                    }
                },
                data: {
                    profileId
                }
            })
        ]);
    },

    /**
     * Deletes a user membership from a company
     */
    async removeFromCompany(userId: string, companyId: string) {
        return db.userCompany.delete({
            where: {
                userId_companyId: {
                    userId,
                    companyId,
                },
            },
        });
    }
};
