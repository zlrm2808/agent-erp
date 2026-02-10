import { db } from "@/lib/orm";

export const InventoryRepository = {
    /**
     * Get all product categories for a company
     */
    async getCategories(companyId: string) {
        return db.productCategory.findMany({
            where: { companyId },
            include: { _count: { select: { products: true } } },
            orderBy: { name: "asc" }
        });
    },

    /**
     * Create a new product category
     */
    async createCategory(companyId: string, data: { name: string; description?: string }) {
        return db.productCategory.create({
            data: {
                companyId,
                ...data
            }
        });
    },

    /**
     * Get all products for a company
     */
    async getProducts(companyId: string) {
        return db.product.findMany({
            where: { companyId },
            include: { category: true },
            orderBy: { name: "asc" }
        });
    },

    /**
     * Get a single product by ID
     */
    async getProductById(companyId: string, productId: string) {
        return db.product.findUnique({
            where: { id: productId },
            include: { category: true }
        });
    },

    /**
     * Create a new product
     */
    async createProduct(companyId: string, data: {
        sku: string;
        name: string;
        description?: string;
        categoryId?: string;
        costPrice?: number;
        salePrice?: number;
        minStock?: number;
    }) {
        return db.product.create({
            data: {
                companyId,
                ...data
            }
        });
    },

    /**
     * Update an existing product
     */
    async updateProduct(companyId: string, productId: string, data: {
        sku?: string;
        name?: string;
        description?: string;
        categoryId?: string;
        costPrice?: number;
        salePrice?: number;
        minStock?: number;
        stock?: number;
    }) {
        return db.product.update({
            where: { id: productId, companyId },
            data: {
                ...data, // stock update here overrides arithmetic if passed directly? 
                // Usually stock is updated via movements, but editing product might allow direct stock correction (though hazardous for audit).
                // For now allow it as "correction".
            }
        });
    },
    /**
     * Record an inventory movement and update stock
     * This uses a transaction to ensure data integrity
     */
    async recordMovement(data: {
        companyId: string;
        productId: string;
        type: "IN" | "OUT" | "ADJUSTMENT";
        quantity: number;
        userId: string;
        reference?: string;
        notes?: string;
    }) {
        return db.$transaction(async (tx: any) => {
            // 1. Calculate stock change
            const stockChange = data.type === "OUT" ? -data.quantity : data.quantity;

            // 2. Update product stock
            const product = await tx.product.update({
                where: { id: data.productId },
                data: {
                    stock: { increment: stockChange }
                }
            });

            // 3. Create movement record
            const movement = await tx.inventoryMovement.create({
                data: {
                    companyId: data.companyId,
                    productId: data.productId,
                    userId: data.userId,
                    type: data.type,
                    quantity: data.quantity,
                    reference: data.reference,
                    notes: data.notes
                }
            });

            return { product, movement };
        });
    },

    /**
     * Get dashboard statistics
     */
    async getDashboardStats(companyId: string) {
        const products = await db.product.findMany({
            where: { companyId },
            select: { stock: true, costPrice: true, minStock: true }
        });

        const totalProducts = products.length;
        const totalValue = products.reduce((acc: number, curr: { stock: number; costPrice: number }) => acc + (curr.stock * curr.costPrice), 0);
        const lowStock = products.filter((p: { stock: number; minStock: number }) => p.stock <= p.minStock).length;

        return {
            totalProducts,
            totalValue,
            lowStock
        };
    }
};
