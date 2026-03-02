import { getTenantDb } from "@/lib/tenant-db";

const MOVEMENT_WINDOW_DAYS = 60;

export const InventoryRepository = {
    async getProducts(companyId: string, branchId?: string | null) {
        try {
            const tenantDb = await getTenantDb(companyId);
            return await tenantDb.product.findMany({
                where: branchId ? { branchId } : {},
                include: { branch: true, accountingGroup: true },
                orderBy: { name: "asc" },
            });
        } catch (error) {
            console.error(`[InventoryRepository] Error in getProducts for ${companyId}:`, error);
            return [];
        }
    },

    async getProductById(companyId: string, productId: string) {
        const tenantDb = await getTenantDb(companyId);
        return tenantDb.product.findFirst({
            where: { id: productId },
            include: { branch: true, accountingGroup: true },
        });
    },

    async createProduct(
        companyId: string,
        data: {
            sku: string;
            name: string;
            description?: string;
            costPrice?: number;
            salePrice?: number;
            minStock?: number;
            stock?: number;
            branchId?: string | null;
            accountingGroupId?: string | null;
        },
    ) {
        const tenantDb = await getTenantDb(companyId);
        return tenantDb.product.create({
            data,
        });
    },

    async updateProduct(
        companyId: string,
        productId: string,
        data: {
            sku?: string;
            name?: string;
            description?: string;
            costPrice?: number;
            salePrice?: number;
            minStock?: number;
            stock?: number;
            branchId?: string | null;
            accountingGroupId?: string | null;
        },
    ) {
        const tenantDb = await getTenantDb(companyId);
        return tenantDb.product.update({
            where: { id: productId },
            data,
        });
    },

    async recordMovement(companyId: string, data: {
        productId: string;
        type: string;
        quantity: number;
        userId: string;
        reference?: string;
        notes?: string;
    }) {
        const tenantDb = await getTenantDb(companyId);
        const { productId, type, quantity, userId, reference, notes } = data;

        return tenantDb.$transaction(async (tx) => {
            const product = await tx.product.findUnique({
                where: { id: productId },
            });

            if (!product) {
                throw new Error("PRODUCT_NOT_FOUND");
            }

            const stockChange = type === "OUT" ? -quantity : quantity;

            const updatedProduct = await tx.product.update({
                where: { id: productId },
                data: {
                    stock: { increment: stockChange },
                },
            });

            const movement = await tx.inventoryMovement.create({
                data: {
                    productId,
                    userId,
                    type,
                    quantity,
                    reference,
                    notes,
                },
            });

            return { product: updatedProduct, movement };
        });
    },

    async getRecentMovements(companyId: string, branchId?: string | null, limit = 5) {
        try {
            const tenantDb = await getTenantDb(companyId);
            return await tenantDb.inventoryMovement.findMany({
                where: branchId ? { product: { branchId } } : {},
                include: {
                    product: { select: { name: true, sku: true } },
                },
                orderBy: { createdAt: "desc" },
                take: limit,
            });
        } catch (error) {
            console.error(`[InventoryRepository] Error in getRecentMovements for ${companyId}:`, error);
            return [];
        }
    },

    async getDashboardStats(companyId: string, branchId?: string | null) {
        try {
            const tenantDb = await getTenantDb(companyId);
            const cutoffDate = new Date(Date.now() - MOVEMENT_WINDOW_DAYS * 24 * 60 * 60 * 1000);

            const where = branchId ? { branchId } : {};

            const [products, movedProductsInWindow] = await Promise.all([
                tenantDb.product.findMany({
                    where,
                    select: { id: true, stock: true, costPrice: true, minStock: true },
                }),
                tenantDb.inventoryMovement.findMany({
                    where: {
                        createdAt: { gte: cutoffDate },
                        product: branchId ? { branchId } : {},
                    },
                    distinct: ["productId"] as any, // Cast as any because some Prisma versions have issues with distinct type on SQLite
                    select: { productId: true },
                }),
            ]);

            const movedProductIds = new Set(movedProductsInWindow.map((movement: any) => movement.productId));

            return {
                totalProducts: products.length,
                totalValue: products.reduce((acc: number, curr: any) => acc + curr.stock * curr.costPrice, 0),
                lowStock: products.filter((p: any) => p.stock <= p.minStock).length,
                inactiveProducts: products.filter((product: any) => !movedProductIds.has(product.id)).length,
            };
        } catch (error) {
            console.error(`[InventoryRepository] Error in getDashboardStats for ${companyId}:`, error);
            return {
                totalProducts: 0,
                totalValue: 0,
                lowStock: 0,
                inactiveProducts: 0
            };
        }
    },


};
