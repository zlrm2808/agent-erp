import { db } from "@/lib/orm";

export const CompanyRepository = {
    /**
     * Finds all companies associated with a specific user
     */
    async findByUserId(userId: string) {
        return db.company.findMany({
            where: {
                users: {
                    some: {
                        userId,
                    },
                },
            },
        });
    },

    /**
     * Finds a single company by ID
     */
    async findById(id: string) {
        return db.company.findUnique({
            where: { id },
        });
    },

    /**
     * Validates if a user has access to company.
     */
    async userHasAccess(userId: string, companyId: string) {
        const membership = await db.userCompany.findUnique({
            where: {
                userId_companyId: {
                    userId,
                    companyId,
                },
            },
        });

        return Boolean(membership);
    },

    /**
     * Creates a new company and associates it with a user as an admin.
     * Also creates the first mandatory branch.
     */
    async create(
        data: {
            name: string;
            rif: string;
            address: string;
            phone?: string;
            databaseUrl: string;
            branchName: string;
        },
        userId: string,
    ) {
        return db.company.create({
            data: {
                name: data.name,
                rif: data.rif,
                address: data.address,
                phone: data.phone,
                databaseUrl: data.databaseUrl,
                branches: {
                    create: {
                        name: data.branchName,
                        address: data.address,
                        phone: data.phone,
                    },
                },
                users: {
                    create: {
                        userId,
                        role: "admin",
                    },
                },
            },
        });
    },
};
