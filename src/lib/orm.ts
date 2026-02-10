/**
 * Custom ORM Repository Interface
 * This follows the Data Mapper / Repository pattern as requested.
 */
export interface Repository<T> {
    findMany(filter?: any): Promise<T[]>;
    findOne(id: string | number): Promise<T | null>;
    create(data: any): Promise<T>;
    update(id: string | number, data: any): Promise<T>;
    delete(id: string | number): Promise<boolean>;
}

/**
 * Base Repository for Global Database operations (Prisma)
 */
import { PrismaClient } from "@prisma/client";

// Global Prisma instance
const globalPrisma = new PrismaClient();

export const db = globalPrisma;
