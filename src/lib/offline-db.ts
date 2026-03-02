import { openDB, IDBPDatabase } from "idb";

/**
 * Native-like wrapper for IndexedDB using 'idb' library for easier async/await support.
 * We'll use this to store transactions when offline.
 */

const DB_NAME = "agent_erp_offline_db";
const DB_VERSION = 1;

export interface OfflineInvoice {
    localId: string;
    offlineCreatedAt: string;
    customerName: string;
    customerRif: string;
    customerAddress?: string;
    branchId: string;
    terminalId?: string;
    items: {
        productId: string;
        productName: string;
        quantity: number;
        unitPrice: number;
        taxRate: number;
        total: number;
    }[];
    baseAmount: number;
    taxAmount: number;
    totalAmount: number;
    currencyId: string;
    exchangeRate: number;
}

export interface OfflineMovement {
    localId: string;
    offlineCreatedAt: string;
    productId: string;
    type: "IN" | "OUT" | "ADJUSTMENT";
    quantity: number;
    reference?: string;
    notes?: string;
}

export async function getOfflineDB() {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            // Store for Invoices
            if (!db.objectStoreNames.contains("invoices")) {
                db.createObjectStore("invoices", { keyPath: "localId" });
            }
            // Store for Inventory Movements
            if (!db.objectStoreNames.contains("movements")) {
                db.createObjectStore("movements", { keyPath: "localId" });
            }
            // Cache for Products (so we can select them while offline)
            if (!db.objectStoreNames.contains("products_cache")) {
                db.createObjectStore("products_cache", { keyPath: "id" });
            }
        },
    });
}

export const OfflineStorage = {
    // Invoices
    async saveInvoice(invoice: OfflineInvoice) {
        const db = await getOfflineDB();
        await db.put("invoices", invoice);
    },
    async getPendingInvoices(): Promise<OfflineInvoice[]> {
        const db = await getOfflineDB();
        return db.getAll("invoices");
    },
    async deleteInvoice(localId: string) {
        const db = await getOfflineDB();
        await db.delete("invoices", localId);
    },

    // Movements
    async saveMovement(movement: OfflineMovement) {
        const db = await getOfflineDB();
        await db.put("movements", movement);
    },
    async getPendingMovements(): Promise<OfflineMovement[]> {
        const db = await getOfflineDB();
        return db.getAll("movements");
    },
    async deleteMovement(localId: string) {
        const db = await getOfflineDB();
        await db.delete("movements", localId);
    },

    // Products Cache
    async updateProductCache(products: any[]) {
        const db = await getOfflineDB();
        const tx = db.transaction("products_cache", "readwrite");
        await tx.store.clear();
        for (const p of products) {
            await tx.store.put(p);
        }
        await tx.done;
    },
    async getCachedProducts(): Promise<any[]> {
        const db = await getOfflineDB();
        return db.getAll("products_cache");
    }
};
