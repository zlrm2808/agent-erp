import { db } from "@/lib/orm";
import type { Prisma } from "@prisma/client";

const MOVEMENT_WINDOW_DAYS = 60;

export const InventoryRepository = {
    async getCategories(companyId: string) {
        return db.productCategory.findMany({
            where: { companyId },
            include: { _count: { select: { products: true } } },
            orderBy: { name: "asc" },
        });
    },

    async createCategory(companyId: string, data: { name: string; description?: string }) {
        return db.productCategory.create({
            data: {
                companyId,
                ...data,
            },
        });
    },

    async getProducts(companyId: string) {
        return db.product.findMany({
            where: { companyId },
            include: { category: true },
            orderBy: { name: "asc" },
        });
    },

    async getProductById(companyId: string, productId: string) {
        return db.product.findFirst({
            where: { id: productId, companyId },
            include: { category: true },
        });
    },

    async createProduct(
        companyId: string,
        data: {
            sku: string;
            name: string;
            description?: string;
            categoryId?: string;
            costPrice?: number;
            salePrice?: number;
            minStock?: number;
            stock?: number;
        },
    ) {
        return db.product.create({
            data: {
                companyId,
                ...data,
            },
        });
    },

    async updateProduct(
        companyId: string,
        productId: string,
        data: {
            sku?: string;
            name?: string;
            description?: string;
            categoryId?: string;
            costPrice?: number;
            salePrice?: number;
            minStock?: number;
            stock?: number;
        },
    ) {
        const existing = await db.product.findFirst({ where: { id: productId, companyId }, select: { id: true } });
        if (!existing) {
            throw new Error("PRODUCT_NOT_FOUND");
        }

        return db.product.update({
            where: { id: existing.id },
            data,
        });
    },

    async recordMovement(data: {
        companyId: string;
        productId: string;
        type: "IN" | "OUT" | "ADJUSTMENT";
        quantity: number;
        userId: string;
        reference?: string;
        notes?: string;
    }) {
        return db.$transaction(async (tx: Prisma.TransactionClient) => {
            const product = await tx.product.findFirst({
                where: {
                    id: data.productId,
                    companyId: data.companyId,
                },
            });

            if (!product) {
                throw new Error("PRODUCT_NOT_FOUND");
            }

            const stockChange = data.type === "OUT" ? -data.quantity : data.quantity;

            const updatedProduct = await tx.product.update({
                where: { id: product.id },
                data: {
                    stock: { increment: stockChange },
                },
            });

            const movement = await tx.inventoryMovement.create({
                data: {
                    companyId: data.companyId,
                    productId: data.productId,
                    userId: data.userId,
                    type: data.type,
                    quantity: data.quantity,
                    reference: data.reference,
                    notes: data.notes,
                },
            });

            return { product: updatedProduct, movement };
        });
    },

    async getRecentMovements(companyId: string, limit = 5) {
        return db.inventoryMovement.findMany({
            where: { companyId },
            include: {
                product: { select: { name: true, sku: true } },
                user: { select: { username: true } },
            },
            orderBy: { createdAt: "desc" },
            take: limit,
        });
    },

    async getDashboardStats(companyId: string) {
        const cutoffDate = new Date(Date.now() - MOVEMENT_WINDOW_DAYS * 24 * 60 * 60 * 1000);

        const [products, movedProductsInWindow] = await Promise.all([
            db.product.findMany({
                where: { companyId },
                select: { id: true, stock: true, costPrice: true, minStock: true },
            }),
            db.inventoryMovement.findMany({
                where: {
                    companyId,
                    createdAt: { gte: cutoffDate },
                },
                distinct: ["productId"],
                select: { productId: true },
            }),
        ]);

        const movedProductIds = new Set(movedProductsInWindow.map((movement) => movement.productId));

        return {
            totalProducts: products.length,
            totalValue: products.reduce((acc, curr) => acc + curr.stock * curr.costPrice, 0),
            lowStock: products.filter((p) => p.stock <= p.minStock).length,
            inactiveProducts: products.filter((product) => !movedProductIds.has(product.id)).length,
        };
    },
};
